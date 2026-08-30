const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  me: null,
  screen: 'landing',
  onboardingStep: 1,
  discover: [],
  discoverIndex: 0,
  matches: [],
  activeMatch: null,
  safetyTarget: null
};

async function api(url, options={}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

function toast(message, type='success') {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.className = 'toast', 2600);
}

function showScreen(name) {
  state.screen = name;
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = $(`#${name}Screen`);
  if (target) target.classList.add('active');

  const loggedIn = Boolean(state.me);
  $('#appNav').classList.toggle('hidden', !loggedIn);
  $('#logoutBtn').classList.toggle('hidden', !loggedIn);
  $('#signInTop').classList.toggle('hidden', loggedIn);
  $('#joinTop').classList.toggle('hidden', loggedIn);
  $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function setAuthMode(mode) {
  const signup = mode === 'signup';
  $('#signupForm').classList.toggle('hidden', !signup);
  $('#loginForm').classList.toggle('hidden', signup);
  $('#signupTab').classList.toggle('active', signup);
  $('#loginTab').classList.toggle('active', !signup);
  $('#authHeadline').textContent = signup ? 'Create your account' : 'Welcome back';
  $('#authSubhead').textContent = signup
    ? 'Start simple. You can build your profile right after joining.'
    : 'Sign in and pick up exactly where you left off.';
  showScreen('auth');
}

function initials(name='?') { return name.trim().slice(0,1).toUpperCase() || '?'; }
function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function splitTags(v='') { return String(v).split(',').map(x => x.trim()).filter(Boolean).slice(0,8); }
function timeLabel(value) {
  if (!value) return '';
  const d = new Date(value); const now = new Date(); const diff = Math.max(0, now-d);
  if (diff < 60_000) return 'now';
  if (diff < 3_600_000) return `${Math.floor(diff/60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff/3_600_000)}h`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}

function photoMarkup(person, cls='') {
  if (person.photo_url) return `<img class="${cls}" src="${escapeHtml(person.photo_url)}" alt="${escapeHtml(person.display_name)}" onerror="this.remove()">`;
  return `<span class="placeholder">${escapeHtml(initials(person.display_name))}</span>`;
}

async function bootstrap() {
  try {
    state.me = await api('/api/me');
    if (!state.me.profile_completed) {
      hydrateForms(state.me);
      startOnboarding();
    } else {
      hydrateForms(state.me);
      showScreen('discover');
      await Promise.all([loadDiscover(), loadMatches()]);
    }
  } catch {
    state.me = null;
    showScreen('landing');
  }
}

function hydrateForms(p) {
  for (const form of [$('#profileForm'), $('#onboardingForm')]) {
    if (!form || !p) continue;
    const map = {
      displayName: p.display_name, country: p.country, city: p.city, occupation: p.occupation,
      gender: p.gender, lookingFor: p.looking_for, relationshipGoal: p.relationship_goal,
      languages: p.languages, interests: p.interests, photoUrl: p.photo_url, bio: p.bio
    };
    Object.entries(map).forEach(([name,value]) => { if (form.elements[name]) form.elements[name].value = value || ''; });
  }
  if ($('#discoveryToggle')) $('#discoveryToggle').checked = Boolean(p.discovery_enabled);
}

function startOnboarding() {
  state.onboardingStep = 1;
  updateOnboarding();
  showScreen('onboarding');
}

function updateOnboarding() {
  $$('.onboarding-step').forEach(step => step.classList.toggle('active', Number(step.dataset.step) === state.onboardingStep));
  $('#progressText').textContent = `Step ${state.onboardingStep} of 3`;
  $('#progressBar').style.width = `${state.onboardingStep * 33.333}%`;
  $('#onboardingBack').classList.toggle('hidden', state.onboardingStep === 1);
  $('#onboardingNext').classList.toggle('hidden', state.onboardingStep === 3);
  $('#onboardingSave').classList.toggle('hidden', state.onboardingStep !== 3);
}

function formPayload(form) {
  const d = new FormData(form);
  return Object.fromEntries([...d.entries()].map(([k,v]) => [k, String(v).trim()]));
}

async function saveProfileFrom(form) {
  const payload = formPayload(form);
  const saved = await api('/api/profile', { method:'PUT', body: JSON.stringify(payload) });
  state.me = saved;
  hydrateForms(saved);
  return saved;
}

async function loadDiscover() {
  if (!state.me?.profile_completed) return;
  $('#discoverLoading').classList.remove('hidden');
  $('#discoverEmpty').classList.add('hidden');
  $('#profileCard').classList.add('hidden');
  try {
    const f = formPayload($('#filterForm'));
    const qs = new URLSearchParams(f).toString();
    state.discover = await api(`/api/discover?${qs}`);
    state.discoverIndex = 0;
    renderDiscover();
  } catch (e) {
    toast(e.message,'error');
  } finally {
    $('#discoverLoading').classList.add('hidden');
  }
}

function currentProfile() { return state.discover[state.discoverIndex]; }

function renderDiscover() {
  const p = currentProfile();
  const card = $('#profileCard');
  if (!p) {
    card.classList.add('hidden');
    $('#discoverEmpty').classList.remove('hidden');
    return;
  }
  $('#discoverEmpty').classList.add('hidden');
  const interests = splitTags(p.interests);
  card.innerHTML = `
    <div class="profile-photo">${photoMarkup(p)}</div>
    <div class="profile-body">
      <div class="profile-title"><h2>${escapeHtml(p.display_name)}, ${p.age}</h2><span class="intent-pill">${escapeHtml(p.relationship_goal || 'Dating intentionally')}</span></div>
      <p class="location">${escapeHtml([p.city,p.country].filter(Boolean).join(', '))}</p>
      <p class="profile-bio">${escapeHtml(p.bio || 'Getting to know people with intention.')}</p>
      ${interests.length ? `<div>${interests.map(x=>`<span class="interest-pill">${escapeHtml(x)}</span>`).join('')}</div>` : ''}
      <div class="profile-meta">
        <div class="meta-box"><small>Languages</small><b>${escapeHtml(p.languages || 'Not listed')}</b></div>
        <div class="meta-box"><small>Occupation</small><b>${escapeHtml(p.occupation || 'Not listed')}</b></div>
      </div>
      <div class="card-actions">
        <button class="round-action" data-card-action="safety" title="Safety options">•••</button>
        <button class="secondary-btn" data-card-action="pass">Pass</button>
        <button class="primary-btn" data-card-action="like">Like ♥</button>
      </div>
    </div>`;
  card.classList.remove('hidden');
}

function nextProfile() { state.discoverIndex++; renderDiscover(); }

async function likeCurrent() {
  const p = currentProfile(); if (!p) return;
  try {
    const result = await api(`/api/like/${p.id}`, { method:'POST' });
    nextProfile();
    if (result.matched) {
      await loadMatches();
      $('#matchModalText').textContent = `You and ${result.person?.display_name || 'your match'} both chose each other.`;
      $('#matchMessageBtn').dataset.matchId = result.matchId;
      $('#matchModal').classList.remove('hidden');
    } else toast('Like sent ✓');
  } catch (e) { toast(e.message,'error'); }
}

async function passCurrent() {
  const p = currentProfile(); if (!p) return;
  try { await api(`/api/pass/${p.id}`, { method:'POST' }); nextProfile(); }
  catch (e) { toast(e.message,'error'); }
}

async function loadMatches() {
  try {
    state.matches = await api('/api/matches');
    renderMatches(); renderConversationList(); updateMatchBadge();
  } catch (e) { toast(e.message,'error'); }
}

function updateMatchBadge() {
  const total = state.matches.reduce((n,m)=>n+(m.unread_count||0),0);
  const badge = $('#matchBadge');
  badge.textContent = total;
  badge.classList.toggle('hidden', total < 1);
}

function renderMatches() {
  const grid = $('#matchesGrid');
  if (!state.matches.length) {
    grid.innerHTML = `<div class="state-card"><div class="state-icon">♡</div><h3>No matches yet</h3><p>When someone you like chooses you back, they'll appear here.</p><button class="primary-btn" data-go-discover>Discover people</button></div>`;
    return;
  }
  grid.innerHTML = state.matches.map(m => `
    <article class="match-card">
      <div class="match-photo">${m.photo_url ? `<img src="${escapeHtml(m.photo_url)}" alt="${escapeHtml(m.display_name)}">` : escapeHtml(initials(m.display_name))}</div>
      <div class="match-body"><h3>${escapeHtml(m.display_name)}</h3><small>${escapeHtml([m.city,m.country].filter(Boolean).join(', '))}</small><p>${escapeHtml(m.last_message || 'You matched — say hello.')}</p>
      <div class="match-actions"><button class="primary-btn" data-chat="${m.match_id}">Message${m.unread_count ? ` (${m.unread_count})` : ''}</button><button class="secondary-btn" data-match-safety="${m.id}">•••</button></div></div>
    </article>`).join('');
}

function renderConversationList() {
  const list = $('#conversationList');
  if (!state.matches.length) { list.innerHTML = `<div class="state-card" style="margin:16px;width:auto;padding:28px 18px"><p>No conversations yet.</p></div>`; return; }
  list.innerHTML = state.matches.map(m => `
    <button class="conversation-item ${state.activeMatch?.match_id===m.match_id?'active':''}" data-chat="${m.match_id}">
      <span class="conversation-avatar">${m.photo_url ? `<img src="${escapeHtml(m.photo_url)}" alt="">` : escapeHtml(initials(m.display_name))}</span>
      <span class="conversation-copy"><b>${escapeHtml(m.display_name)}</b><span>${escapeHtml(m.last_message || 'You matched')}</span></span>
      ${m.unread_count ? `<span class="unread-dot">${m.unread_count}</span>` : `<small>${timeLabel(m.last_message_at)}</small>`}
    </button>`).join('');
}

async function openChat(matchId) {
  const match = state.matches.find(m => Number(m.match_id) === Number(matchId));
  if (!match) return;
  state.activeMatch = match;
  showScreen('chat');
  $('.chat-shell').classList.add('chat-open');
  renderConversationList();
  $('#chatHeader').innerHTML = `<div><h3>${escapeHtml(match.display_name)}</h3><p>${escapeHtml([match.city,match.country].filter(Boolean).join(', '))}</p></div><div style="margin-left:auto;display:flex;gap:8px"><button class="secondary-btn" data-chat-safety="${match.id}">Safety</button><button class="secondary-btn" data-unmatch="${match.match_id}">Unmatch</button></div>`;
  await loadMessages();
  await loadMatches();
}

async function loadMessages() {
  if (!state.activeMatch) return;
  try {
    const messages = await api(`/api/messages/${state.activeMatch.match_id}`);
    const box = $('#chatMessages');
    box.innerHTML = messages.length ? messages.map(msg => `
      <div class="message-row ${Number(msg.sender_id)===Number(state.me.id)?'mine':''}"><div class="message-bubble">${escapeHtml(msg.body)}<small>${new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join('') : `<div class="chat-empty"><span>♡</span><p>You matched. Start with something genuine.</p></div>`;
    box.scrollTop = box.scrollHeight;
  } catch (e) { toast(e.message,'error'); }
}

function openSafety(personId, name='this person') {
  state.safetyTarget = Number(personId);
  $('#safetyTitle').textContent = `Safety options for ${name}`;
  $('#reportReason').value = '';
  $('#safetyModal').classList.remove('hidden');
}

function closeModals() { $$('.modal').forEach(m => m.classList.add('hidden')); }

// top/landing/auth
$('[data-action="home"]').addEventListener('click', () => state.me ? showScreen('discover') : showScreen('landing'));
$('#signInTop').addEventListener('click', () => setAuthMode('login'));
$('#joinTop').addEventListener('click', () => setAuthMode('signup'));
$('#heroJoin').addEventListener('click', () => setAuthMode('signup'));
$('#heroSignIn').addEventListener('click', () => setAuthMode('login'));
$('#signupTab').addEventListener('click', () => setAuthMode('signup'));
$('#loginTab').addEventListener('click', () => setAuthMode('login'));

$('#signupForm').addEventListener('submit', async e => {
  e.preventDefault();
  const button = $('button[type="submit"]', e.currentTarget); button.disabled = true; button.textContent = 'Creating account…';
  try {
    const result = await api('/api/signup', { method:'POST', body: JSON.stringify(formPayload(e.currentTarget)) });
    state.me = await api('/api/me');
    hydrateForms(state.me);
    toast('Account created successfully ✓');
    startOnboarding();
  } catch (err) { toast(err.message,'error'); }
  finally { button.disabled=false; button.textContent='Create account'; }
});

$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const button = $('button[type="submit"]', e.currentTarget); button.disabled=true; button.textContent='Signing in…';
  try {
    const result = await api('/api/login', { method:'POST', body: JSON.stringify(formPayload(e.currentTarget)) });
    state.me = result.user || await api('/api/me');
    hydrateForms(state.me);
    toast('Welcome back ✓');
    if (result.next === 'onboarding' || !state.me.profile_completed) startOnboarding();
    else { showScreen('discover'); await Promise.all([loadDiscover(),loadMatches()]); }
  } catch (err) { toast(err.message,'error'); }
  finally { button.disabled=false; button.textContent='Sign in'; }
});

$('#logoutBtn').addEventListener('click', async () => {
  try { await api('/api/logout',{method:'POST'}); } catch {}
  state.me=null; state.activeMatch=null; state.matches=[]; showScreen('landing'); toast('Signed out.');
});

$$('.nav-item').forEach(btn => btn.addEventListener('click', async () => {
  const name = btn.dataset.screen;
  showScreen(name);
  if (name === 'discover') await loadDiscover();
  if (name === 'matches') await loadMatches();
  if (name === 'profile') hydrateForms(state.me);
}));

// onboarding
$('#onboardingNext').addEventListener('click', () => { state.onboardingStep = Math.min(3,state.onboardingStep+1); updateOnboarding(); });
$('#onboardingBack').addEventListener('click', () => { state.onboardingStep = Math.max(1,state.onboardingStep-1); updateOnboarding(); });
$('#onboardingForm').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const saved = await saveProfileFrom(e.currentTarget);
    if (!saved.profile_completed) return toast('Add a relationship goal and a short bio to finish your profile.','error');
    toast('Profile ready ✓');
    showScreen('discover');
    await Promise.all([loadDiscover(),loadMatches()]);
  } catch (err) { toast(err.message,'error'); }
});

// discover
$('#filterForm').addEventListener('submit', e => { e.preventDefault(); loadDiscover(); });
$('#resetFilters').addEventListener('click', () => { $('#filterForm').reset(); $('#filterForm').elements.minAge.value=18; $('#filterForm').elements.maxAge.value=99; loadDiscover(); });
$('#profileCard').addEventListener('click', e => {
  const action = e.target.closest('[data-card-action]')?.dataset.cardAction;
  if (!action) return;
  if (action==='like') likeCurrent();
  if (action==='pass') passCurrent();
  if (action==='safety') { const p=currentProfile(); if(p) openSafety(p.id,p.display_name); }
});

// matches/chat delegation
document.addEventListener('click', async e => {
  const chat = e.target.closest('[data-chat]'); if (chat) return openChat(chat.dataset.chat);
  if (e.target.closest('[data-go-discover]')) { showScreen('discover'); return loadDiscover(); }
  const safety = e.target.closest('[data-match-safety]'); if (safety) { const m=state.matches.find(x=>Number(x.id)===Number(safety.dataset.matchSafety)); if(m) openSafety(m.id,m.display_name); }
  const chatSafety = e.target.closest('[data-chat-safety]'); if (chatSafety && state.activeMatch) openSafety(state.activeMatch.id,state.activeMatch.display_name);
  const unmatch = e.target.closest('[data-unmatch]');
  if (unmatch) {
    if (!confirm('Unmatch this person? This conversation will be removed.')) return;
    try { await api(`/api/matches/${unmatch.dataset.unmatch}`,{method:'DELETE'}); state.activeMatch=null; toast('Unmatched.'); showScreen('matches'); await loadMatches(); } catch(err){toast(err.message,'error');}
  }
  if (e.target.matches('[data-close-modal], .modal')) closeModals();
});

$('#chatBack').addEventListener('click', () => { $('.chat-shell').classList.remove('chat-open'); showScreen('matches'); });
$('#chatForm').addEventListener('submit', async e => {
  e.preventDefault(); if (!state.activeMatch) return toast('Choose a conversation first.','error');
  const input=$('#chatInput'), body=input.value.trim(); if(!body) return;
  input.value='';
  try { await api(`/api/messages/${state.activeMatch.match_id}`,{method:'POST',body:JSON.stringify({body})}); await loadMessages(); await loadMatches(); } catch(err){input.value=body;toast(err.message,'error');}
});

// profile/settings
$('#profileForm').addEventListener('submit', async e => {
  e.preventDefault();
  try { await saveProfileFrom(e.currentTarget); toast('Profile saved ✓'); }
  catch(err){ toast(err.message,'error'); }
});
$('#discoveryToggle').addEventListener('change', async e => {
  try { await api('/api/settings/discovery',{method:'PUT',body:JSON.stringify({enabled:e.target.checked})}); state.me.discovery_enabled=e.target.checked; toast(e.target.checked?'You are visible in Discover.':'Discovery paused.'); }
  catch(err){ e.target.checked=!e.target.checked; toast(err.message,'error'); }
});
$('#deleteAccountBtn').addEventListener('click', async () => {
  if (!confirm('Delete your VOWSI account permanently? This cannot be undone.')) return;
  if (!confirm('Final confirmation: delete all profile, match and message data?')) return;
  try { await api('/api/account',{method:'DELETE'}); state.me=null; showScreen('landing'); toast('Account deleted.'); } catch(err){toast(err.message,'error');}
});

// safety & match modal
$('#reportBtn').addEventListener('click', async () => {
  if (!state.safetyTarget) return;
  const reason=$('#reportReason').value.trim();
  try { await api(`/api/report/${state.safetyTarget}`,{method:'POST',body:JSON.stringify({reason})}); closeModals(); toast('Report submitted. Thank you.'); } catch(err){toast(err.message,'error');}
});
$('#blockBtn').addEventListener('click', async () => {
  if (!state.safetyTarget) return;
  if (!confirm('Block this person? They will no longer appear to you.')) return;
  try { await api(`/api/block/${state.safetyTarget}`,{method:'POST'}); closeModals(); toast('Person blocked.'); if(state.screen==='discover') loadDiscover(); else {showScreen('matches');loadMatches();} } catch(err){toast(err.message,'error');}
});
$('#matchMessageBtn').addEventListener('click', async e => { const id=e.currentTarget.dataset.matchId; closeModals(); await loadMatches(); openChat(id); });

bootstrap();
