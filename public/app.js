const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
function isCountry(v){return COUNTRIES.some(c=>c.toLowerCase()===String(v||'').trim().toLowerCase());}
function initCountries(){const dl=$('#countryList');if(dl)dl.innerHTML=COUNTRIES.map(c=>`<option value="${escapeHtml(c)}"></option>`).join('');}


const state = {
  me: null,
  screen: 'landing',
  onboardingStep: 1,
  discover: [],
  discoverIndex: 0,
  matches: [],
  activeMatch: null,
  safetyTarget: null,
  pollTimer: null
};

async function api(url, options={}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: isForm ? (options.headers || {}) : { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    const err = new Error(data.error || 'Something went wrong.');
    err.field = data.field;
    throw err;
  }
  return data;
}

function toast(message, type='success', duration=2600) {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.className = 'toast', duration);
}

function showScreen(name) {
  state.screen = name;
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(`#${name}Screen`)?.classList.add('active');

  const loggedIn = Boolean(state.me);
  const appNavigationAllowed = loggedIn && !['onboarding','landing','auth'].includes(name);
  $('#appNav').classList.toggle('hidden', !appNavigationAllowed);
  $('#logoutBtn').classList.toggle('hidden', !loggedIn);
  $('#accountChip').classList.toggle('hidden', !loggedIn);
  if(loggedIn){$('#accountName').textContent=state.me.display_name||'Profile';$('#accountAvatar').textContent=initials(state.me.display_name);}
  $('#signInTop').classList.toggle('hidden', loggedIn);
  $('#joinTop').classList.toggle('hidden', loggedIn);
  $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function setAuthMode(mode, notice='') {
  const signup = mode === 'signup';
  $('#signupForm').classList.toggle('hidden', !signup);
  $('#loginForm').classList.toggle('hidden', signup);
  $('#signupTab').classList.toggle('active', signup);
  $('#loginTab').classList.toggle('active', !signup);
  $('#authHeadline').textContent = signup ? 'Create your account' : 'Welcome back';
  $('#authSubhead').textContent = signup
    ? 'Start simple. You can build your profile right after joining.'
    : 'Sign in and pick up exactly where you left off.';
  const noticeEl = $('#authNotice');
  noticeEl.textContent = notice;
  noticeEl.className = notice ? 'inline-notice success' : 'inline-notice success hidden';
  $('#loginError').classList.add('hidden');
  clearErrors($('#signupForm'));
  clearErrors($('#loginForm'));
  showScreen('auth');
}

function initials(name='?') { return name.trim().slice(0,1).toUpperCase() || '?'; }
function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function splitTags(v='') { return String(v).split(',').map(x => x.trim()).filter(Boolean).slice(0,10); }
function timeLabel(value) {
  if (!value) return '';
  const d = new Date(value), now = new Date(), diff = Math.max(0, now-d);
  if (diff < 60_000) return 'now';
  if (diff < 3_600_000) return `${Math.floor(diff/60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff/3_600_000)}h`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}

function formPayload(form) {
  const d = new FormData(form);
  const obj = {};
  for (const [k,v] of d.entries()) obj[k] = typeof v === 'string' ? v.trim() : v;
  return obj;
}

function clearErrors(root=document) {
  $$('.field-error', root).forEach(el => { el.textContent=''; el.classList.remove('show'); });
  $$('input,select,textarea', root).forEach(el => el.classList.remove('invalid'));
}

function fieldError(form, name, message, alias=name) {
  const target = form?.querySelector?.(`[name="${name}"]`);
  target?.classList?.add('invalid');
  const err = form?.querySelector(`[data-error-for="${alias}"]`) || document.querySelector(`[data-error-for="${alias}"]`);
  if (err) { err.textContent = message; err.classList.add('show'); }
  return false;
}

function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function ageFromDate(value) {
  const b = new Date(value); if (Number.isNaN(b.getTime())) return -1;
  const n = new Date(); let y = n.getFullYear()-b.getFullYear();
  if (n < new Date(n.getFullYear(),b.getMonth(),b.getDate())) y--;
  return y;
}

function validateSignup() {
  const form = $('#signupForm'); clearErrors(form); const p=formPayload(form); let ok=true;
  if (!p.displayName) ok=fieldError(form,'displayName','Enter your display name.') && ok;
  if (!p.email || !validEmail(p.email)) ok=fieldError(form,'email','Enter a valid email address.') && ok;
  if (!p.password || p.password.length<10) ok=fieldError(form,'password','Use at least 10 characters.') && ok;
  if (!p.birthDate) ok=fieldError(form,'birthDate','Choose your date of birth.') && ok;
  else if (ageFromDate(p.birthDate)<18) ok=fieldError(form,'birthDate','VOWSI is for adults 18+ only.') && ok;
  if (!p.country) ok=fieldError(form,'country','Choose your country.') && ok;
  else if(!isCountry(p.country)) ok=fieldError(form,'country','Choose a country from the list.') && ok;
  if (!form.elements.acceptedTerms.checked) ok=fieldError(form,'acceptedTerms','Please accept the Terms and Community Guidelines.','acceptedTerms') && ok;
  return ok;
}

function validateLogin() {
  const form=$('#loginForm'); clearErrors(form); $('#loginError').classList.add('hidden'); const p=formPayload(form); let ok=true;
  if (!p.email || !validEmail(p.email)) ok=fieldError(form,'email','Enter your email address.','loginEmail') && ok;
  if (!p.password) ok=fieldError(form,'password','Enter your password.','loginPassword') && ok;
  return ok;
}

async function bootstrap() {
  try {
    state.me = await api('/api/me');
    hydrateForms(state.me);
    startPolling();
    if (!state.me.profile_completed) startOnboarding();
    else { showScreen('discover'); await Promise.all([loadDiscover(),loadMatches()]); }
  } catch {
    state.me=null; showScreen('landing');
  }
}

function setRadio(form, name, value) {
  const radio = form?.elements?.[name];
  if (!radio || !value) return;
  [...radio].forEach?.(r => { r.checked = r.value === value; });
}

function hydrateForms(p) {
  if (!p) return;
  const map={displayName:p.display_name,country:p.country,city:p.city,occupation:p.occupation,gender:p.gender,lookingFor:p.looking_for||'Everyone',languages:p.languages,interests:p.interests,bio:p.bio};
  for (const form of [$('#profileForm'),$('#onboardingForm')]) {
    if (!form) continue;
    Object.entries(map).forEach(([name,value])=>{ if(form.elements[name]) form.elements[name].value=value||''; });
  }
  setRadio($('#onboardingForm'),'relationshipGoal',p.relationship_goal);
  if ($('#profileForm')?.elements.relationshipGoal) $('#profileForm').elements.relationshipGoal.value=p.relationship_goal||'';
  $('#discoveryToggle').checked=Boolean(p.discovery_enabled);
  renderPhotos();
}

function startOnboarding() {
  state.onboardingStep=1; updateOnboarding(); showScreen('onboarding'); renderPhotos();
}

function updateOnboarding() {
  $$('.onboarding-step').forEach(step=>step.classList.toggle('active',Number(step.dataset.step)===state.onboardingStep));
  $('#progressText').textContent=`Step ${state.onboardingStep} of 3`;
  $('#progressBar').style.width=`${state.onboardingStep*33.333}%`;
  $('#onboardingBack').classList.toggle('hidden',state.onboardingStep===1);
  $('#onboardingNext').classList.toggle('hidden',state.onboardingStep===3);
  $('#onboardingSave').classList.toggle('hidden',state.onboardingStep!==3);
  clearErrors($('#onboardingForm'));
  window.scrollTo({top:0,behavior:'auto'});
}

function validateOnboardingStep(step) {
  const form=$('#onboardingForm'); clearErrors(form); let ok=true;
  if (step===1) {
    if (!form.elements.displayName.value.trim()) ok=fieldError(form,'displayName','Add your display name.') && ok;
    if (!form.elements.country.value.trim()) ok=fieldError(form,'country','Choose your country.') && ok;
    else if(!isCountry(form.elements.country.value)) ok=fieldError(form,'country','Choose a country from the list.') && ok;
  }
  if (step===2) {
    const goal=[...form.elements.relationshipGoal].find(r=>r.checked)?.value;
    if (!goal) ok=fieldError(form,'relationshipGoal','Choose what you are hoping to find.') && ok;
  }
  if (step===3) {
    if (!(state.me?.photos?.length || state.me?.photo_url)) { const el=document.querySelector('[data-error-for="photos"]'); el.textContent='Add at least one photo.'; el.classList.add('show'); ok=false; }
    if (!form.elements.bio.value.trim()) ok=fieldError(form,'bio','Write a short bio so people know a little about you.') && ok;
  }
  return ok;
}

function onboardingPayload() {
  const form=$('#onboardingForm'); const p=formPayload(form);
  p.relationshipGoal=[...form.elements.relationshipGoal].find(r=>r.checked)?.value||'';
  return p;
}

async function saveOnboarding() {
  const payload=onboardingPayload();
  const saved=await api('/api/profile',{method:'PUT',body:JSON.stringify(payload)});
  state.me=saved; hydrateForms(saved); return saved;
}

function renderPhotos() {
  const photos=state.me?.photos||[];
  for (const id of ['onboardingPhotos','profilePhotos']) {
    const root=$(`#${id}`); if(!root) continue;
    root.innerHTML='';
    photos.forEach((photo,index)=>{
      const item=document.createElement('div'); item.className='photo-tile';
      item.innerHTML=`<img src="${escapeHtml(photo.url)}" alt="Profile photo ${index+1}"><div class="photo-actions">${index?`<button type="button" data-photo-first="${photo.id}">Make first</button>`:'<span>Main</span>'}<button type="button" data-photo-delete="${photo.id}">Remove</button></div>`;
      root.appendChild(item);
    });
    if (!photos.length && state.me?.photo_url) {
      const item=document.createElement('div'); item.className='photo-tile legacy-photo'; item.innerHTML=`<img src="${escapeHtml(state.me.photo_url)}" alt="Current profile photo"><div class="photo-actions"><span>Current photo</span></div>`; root.appendChild(item);
    }
    for(let i=(photos.length || (state.me?.photo_url?1:0)); i<Math.min(6,Math.max(3,(photos.length||0)+1)); i++) {
      const empty=document.createElement('label'); empty.className='photo-tile empty'; empty.innerHTML=`<span>+</span><small>Add photo</small><input type="file" accept="image/jpeg,image/png,image/webp" hidden data-inline-photo>`; root.appendChild(empty);
    }
  }
}

async function optimizeImage(file){
  if(!file?.type?.startsWith('image/')) return file;
  try{
    const bitmap=await createImageBitmap(file), max=1400, scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
    const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.84));
    return blob ? new File([blob],(file.name||'photo').replace(/\.[^.]+$/, '')+'.jpg',{type:'image/jpeg'}) : file;
  }catch{return file;}
}

async function uploadFiles(fileList) {
  const files=[...fileList].slice(0,Math.max(0,6-(state.me?.photos?.length||0)));
  if (!files.length) return;
  for (const file of files) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { toast('Use JPG, PNG or WebP images.','error'); continue; }
    if (file.size>3*1024*1024) { toast(`${file.name} is larger than 3 MB.`,'error'); continue; }
    const optimized=await optimizeImage(file); const fd=new FormData(); fd.append('photo',optimized);
    try { await api('/api/photos',{method:'POST',body:fd}); }
    catch(e){ toast(e.message,'error',4000); }
  }
  state.me=await api('/api/me'); hydrateForms(state.me); renderPhotos();
}

async function deletePhoto(id) {
  try { await api(`/api/photos/${id}`,{method:'DELETE'}); state.me=await api('/api/me'); hydrateForms(state.me); renderPhotos(); toast('Photo removed.'); }
  catch(e){toast(e.message,'error');}
}

async function makePhotoFirst(id) {
  const ids=(state.me?.photos||[]).map(p=>p.id); const idx=ids.indexOf(Number(id)); if(idx<0)return;
  ids.splice(idx,1); ids.unshift(Number(id));
  try { const result=await api('/api/photos/order',{method:'PUT',body:JSON.stringify({ids})}); state.me.photos=result.photos; state.me.photo_url=result.photos[0]?.url||state.me.photo_url; renderPhotos(); toast('Main photo updated ✓'); }
  catch(e){toast(e.message,'error');}
}

function currentProfile(){return state.discover[state.discoverIndex];}
function nextProfile(){state.discoverIndex++;renderDiscover();}

async function loadDiscover() {
  if(!state.me?.profile_completed)return;
  $('#discoverLoading').classList.remove('hidden'); $('#discoverEmpty').classList.add('hidden'); $('#profileCard').classList.add('hidden');
  try { const qs=new URLSearchParams(formPayload($('#filterForm'))).toString(); state.discover=await api(`/api/discover?${qs}`); state.discoverIndex=0; renderDiscover(); }
  catch(e){toast(e.message,'error');}
  finally{$('#discoverLoading').classList.add('hidden');}
}

function renderDiscover() {
  const p=currentProfile(),card=$('#profileCard');
  if(!p){card.classList.add('hidden');$('#discoverEmpty').classList.remove('hidden');return;}
  $('#discoverEmpty').classList.add('hidden'); const interests=splitTags(p.interests);
  card.innerHTML=`<div class="profile-photo">${p.photo_url?`<img src="${escapeHtml(p.photo_url)}" alt="${escapeHtml(p.display_name)}">`:`<span class="placeholder">${escapeHtml(initials(p.display_name))}</span>`}</div><div class="profile-body"><div class="profile-title"><h2>${escapeHtml(p.display_name)}, ${p.age}</h2><span class="intent-pill">${escapeHtml(p.relationship_goal||'Dating intentionally')}</span></div><p class="location">${escapeHtml([p.city,p.country].filter(Boolean).join(', '))}</p><p class="profile-bio">${escapeHtml(p.bio||'Getting to know people with intention.')}</p>${interests.length?`<div>${interests.map(x=>`<span class="interest-pill">${escapeHtml(x)}</span>`).join('')}</div>`:''}<div class="profile-meta"><div class="meta-box"><small>Languages</small><b>${escapeHtml(p.languages||'Not listed')}</b></div><div class="meta-box"><small>Occupation</small><b>${escapeHtml(p.occupation||'Not listed')}</b></div></div><div class="card-actions"><button class="round-action" data-card-action="safety" title="Safety options">•••</button><button class="secondary-btn" data-card-action="pass">Pass</button><button class="primary-btn" data-card-action="like">Like ♥</button></div></div>`;
  card.classList.remove('hidden');
}

async function likeCurrent(){const p=currentProfile();if(!p)return;try{const result=await api(`/api/like/${p.id}`,{method:'POST'});nextProfile();if(result.matched){await loadMatches();$('#matchModalText').textContent=`You and ${result.person?.display_name||'your match'} both chose each other.`;$('#matchMessageBtn').dataset.matchId=result.matchId;$('#matchModal').classList.remove('hidden');}else toast('Like sent ✓');}catch(e){toast(e.message,'error');}}
async function passCurrent(){const p=currentProfile();if(!p)return;try{await api(`/api/pass/${p.id}`,{method:'POST'});nextProfile();}catch(e){toast(e.message,'error');}}

async function loadMatches(){try{state.matches=await api('/api/matches');renderMatches();renderConversationList();updateMatchBadge();}catch(e){toast(e.message,'error');}}
async function updateNotifications(){try{const n=await api('/api/notifications');const mb=$('#matchBadge'),msg=$('#messageBadge');mb.textContent=n.new_matches||0;mb.classList.toggle('hidden',!(n.new_matches>0));msg.textContent=n.unread_messages||0;msg.classList.toggle('hidden',!(n.unread_messages>0));}catch{}}
function updateMatchBadge(){updateNotifications();}
function renderMatches(){const grid=$('#matchesGrid');if(!state.matches.length){grid.innerHTML=`<div class="state-card"><div class="state-icon">♡</div><h3>No matches yet</h3><p>When someone you like chooses you back, they'll appear here.</p><button class="primary-btn" data-go-discover>Discover people</button></div>`;return;}grid.innerHTML=state.matches.map(m=>`<article class="match-card"><div class="match-photo">${m.photo_url?`<img src="${escapeHtml(m.photo_url)}" alt="${escapeHtml(m.display_name)}">`:escapeHtml(initials(m.display_name))}</div><div class="match-body"><h3>${escapeHtml(m.display_name)}</h3><small>${escapeHtml([m.city,m.country].filter(Boolean).join(', '))}</small><p>${escapeHtml(m.last_message||'You matched — say hello.')}</p><div class="match-actions"><button class="primary-btn" data-chat="${m.match_id}">Message${m.unread_count?` (${m.unread_count})`:''}</button><button class="secondary-btn" data-match-safety="${m.id}">•••</button></div></div></article>`).join('');}
function renderConversationList(){const list=$('#conversationList');if(!state.matches.length){list.innerHTML=`<div class="state-card conversation-empty"><p>No conversations yet.</p></div>`;return;}list.innerHTML=state.matches.map(m=>`<button class="conversation-item ${state.activeMatch?.match_id===m.match_id?'active':''}" data-chat="${m.match_id}"><span class="conversation-avatar">${m.photo_url?`<img src="${escapeHtml(m.photo_url)}" alt="">`:escapeHtml(initials(m.display_name))}</span><span class="conversation-copy"><b>${escapeHtml(m.display_name)}</b><span>${escapeHtml(m.last_message||'You matched')}</span></span>${m.unread_count?`<span class="unread-dot">${m.unread_count}</span>`:`<small>${timeLabel(m.last_message_at)}</small>`}</button>`).join('');}

async function openChat(matchId){const match=state.matches.find(m=>Number(m.match_id)===Number(matchId));if(!match)return;state.activeMatch=match;showScreen('chat');$('.chat-shell').classList.add('chat-open');renderConversationList();$('#chatHeader').innerHTML=`<div><h3>${escapeHtml(match.display_name)}</h3><p>${escapeHtml([match.city,match.country].filter(Boolean).join(', '))}</p></div><div class="chat-tools"><button class="secondary-btn" data-chat-safety="${match.id}">Safety</button><button class="secondary-btn" data-unmatch="${match.match_id}">Unmatch</button></div>`;await loadMessages();await loadMatches();}
async function loadMessages(){if(!state.activeMatch)return;try{const messages=await api(`/api/messages/${state.activeMatch.match_id}`),box=$('#chatMessages');box.innerHTML=messages.length?messages.map(msg=>`<div class="message-row ${Number(msg.sender_id)===Number(state.me.id)?'mine':''}"><div class="message-bubble">${escapeHtml(msg.body)}<small>${new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join(''):`<div class="chat-empty"><span>♡</span><p>You matched. Start with something genuine.</p></div>`;box.scrollTop=box.scrollHeight;await updateNotifications();}catch(e){toast(e.message,'error');}}

function openSafety(personId,name='this person'){state.safetyTarget=Number(personId);$('#safetyTitle').textContent=`Safety options for ${name}`;$('#reportReason').value='';$('#safetyModal').classList.remove('hidden');}
function closeModals(){$$('.modal').forEach(m=>m.classList.add('hidden'));}


function startPolling() {
  clearInterval(state.pollTimer);
  if (!state.me) return;
  state.pollTimer = setInterval(async () => {
    if (!state.me) return;
    try {
      await loadMatches();
      await updateNotifications();
      if (state.screen === 'chat' && state.activeMatch) await loadMessages();
    } catch {}
  }, 8000);
}
function stopPolling() { clearInterval(state.pollTimer); state.pollTimer=null; }

const legalCopy={
  safety:{title:'Safety',body:`<p>Your safety comes first. Keep early conversations on VOWSI, never send money or financial information, and meet in a public place when you decide to meet offline.</p><p>Use Report or Block whenever a profile or conversation feels suspicious, abusive or unsafe. If you are in immediate danger, contact local emergency services.</p>`},
  privacy:{title:'Privacy',body:`<p>VOWSI uses the information you provide to operate your account, show your profile to compatible members, support matching and messaging, and help keep the service safe.</p><p>Do not post private information in your bio that you would not want other members to see. You can pause Discover or delete your account from Settings.</p>`},
  terms:{title:'Terms',body:`<p>VOWSI is for adults age 18 and older. You agree to provide accurate account information, use the service lawfully, and avoid harassment, impersonation, fraud, spam or harmful content.</p><p>These starter terms are not a substitute for final jurisdiction-specific legal terms before commercial launch.</p>`},
  community:{title:'Community Guidelines',body:`<p>Be genuine, respectful and safe. Do not impersonate others, solicit money, threaten or harass people, post sexual or violent content without consent, or use VOWSI for scams or spam.</p><p>Members can report or block behavior that violates these guidelines.</p>`}
};
function openLegal(key){const item=legalCopy[key];if(!item)return;$('#legalTitle').textContent=item.title;$('#legalBody').innerHTML=item.body;$('#legalModal').classList.remove('hidden');}

function showProfileReady(){const el=$('#profileReady');el.classList.remove('hidden');setTimeout(()=>el.classList.add('hidden'),900);}

$('[data-action="home"]').addEventListener('click',()=>state.me?(state.me.profile_completed?showScreen('discover'):startOnboarding()):showScreen('landing'));
$('#signInTop').addEventListener('click',()=>setAuthMode('login'));
$('#joinTop').addEventListener('click',()=>setAuthMode('signup'));
$('#heroJoin').addEventListener('click',()=>setAuthMode('signup'));
$('#heroSignIn').addEventListener('click',()=>setAuthMode('login'));
$('#signupTab').addEventListener('click',()=>setAuthMode('signup'));
$('#loginTab').addEventListener('click',()=>setAuthMode('login'));

$('#signupForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!validateSignup())return;
  const form=e.currentTarget,button=$('button[type="submit"]',form),payload=formPayload(form);payload.acceptedTerms=form.elements.acceptedTerms.checked;
  button.disabled=true;button.textContent='Creating account…';
  try{
    const result=await api('/api/signup',{method:'POST',body:JSON.stringify(payload)});
    const email=result.email||payload.email;
    form.reset(); setAuthMode('login','✓ Account created successfully. Sign in to continue.');
    $('#loginForm').elements.email.value=email; $('#loginForm').elements.password.focus();
  }catch(err){
    const errBox=$('#authNotice');errBox.textContent=err.message;errBox.className='inline-notice error';
  }finally{button.disabled=false;button.textContent='Create account';}
});

$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!validateLogin())return;
  const form=e.currentTarget,button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Signing in…';
  try{const result=await api('/api/login',{method:'POST',body:JSON.stringify(formPayload(form))});state.me=result.user||await api('/api/me');hydrateForms(state.me);startPolling();toast('Welcome back ✓');if(result.next==='onboarding'||!state.me.profile_completed)startOnboarding();else{showScreen('discover');await Promise.all([loadDiscover(),loadMatches()]);}}
  catch(err){const box=$('#loginError');box.textContent=err.message;box.classList.remove('hidden');}
  finally{button.disabled=false;button.textContent='Sign in';}
});

$('#logoutBtn').addEventListener('click',async()=>{try{await api('/api/logout',{method:'POST'});}catch{}stopPolling();state.me=null;state.activeMatch=null;state.matches=[];showScreen('landing');toast('Signed out.');});

$$('.nav-item').forEach(btn=>btn.addEventListener('click',async()=>{const name=btn.dataset.screen;showScreen(name);if(name==='discover')await loadDiscover();if(name==='matches'){await loadMatches();await api('/api/matches/seen',{method:'POST'});await updateNotifications();}if(name==='chat'){await loadMatches();renderConversationList();}if(name==='profile'){state.me=await api('/api/me');hydrateForms(state.me);}}));
$('#accountChip').addEventListener('click',async()=>{showScreen('profile');state.me=await api('/api/me');hydrateForms(state.me);});

$('#onboardingNext').addEventListener('click',()=>{if(!validateOnboardingStep(state.onboardingStep))return;state.onboardingStep=Math.min(3,state.onboardingStep+1);updateOnboarding();});
$('#onboardingBack').addEventListener('click',()=>{state.onboardingStep=Math.max(1,state.onboardingStep-1);updateOnboarding();});
$('#onboardingForm').addEventListener('submit',async e=>{e.preventDefault();if(!validateOnboardingStep(3))return;const button=$('#onboardingSave');button.disabled=true;button.textContent='Finishing…';try{await saveOnboarding();showProfileReady();setTimeout(async()=>{showScreen('discover');await Promise.all([loadDiscover(),loadMatches()]);},650);}catch(err){if(err.field==='displayName'){state.onboardingStep=1;updateOnboarding();fieldError(e.currentTarget,'displayName',err.message);}else if(err.field==='country'){state.onboardingStep=1;updateOnboarding();fieldError(e.currentTarget,'country',err.message);}else if(err.field==='relationshipGoal'){state.onboardingStep=2;updateOnboarding();fieldError(e.currentTarget,'relationshipGoal',err.message);}else if(err.field==='photos'){state.onboardingStep=3;updateOnboarding();const el=document.querySelector('[data-error-for="photos"]');el.textContent=err.message;el.classList.add('show');}else if(err.field==='bio'){state.onboardingStep=3;updateOnboarding();fieldError(e.currentTarget,'bio',err.message);}else toast(err.message,'error',4000);}finally{button.disabled=false;button.textContent='Finish profile';}});

$('#onboardingPhotoInput').addEventListener('change',e=>uploadFiles(e.target.files));
$('#profilePhotoInput').addEventListener('change',e=>uploadFiles(e.target.files));
document.addEventListener('change',e=>{if(e.target.matches('[data-inline-photo]'))uploadFiles(e.target.files);});
document.addEventListener('click',e=>{const del=e.target.closest('[data-photo-delete]');if(del)deletePhoto(del.dataset.photoDelete);const first=e.target.closest('[data-photo-first]');if(first)makePhotoFirst(first.dataset.photoFirst);const interest=e.target.closest('[data-interest]');if(interest){const input=$('#onboardingForm').elements.interests;const tags=splitTags(input.value);const value=interest.dataset.interest;if(tags.includes(value))input.value=tags.filter(x=>x!==value).join(', ');else input.value=[...tags,value].slice(0,8).join(', ');interest.classList.toggle('selected',splitTags(input.value).includes(value));}const legal=e.target.closest('[data-legal]');if(legal)openLegal(legal.dataset.legal);});

$('#filterForm').addEventListener('submit',e=>{e.preventDefault();loadDiscover();});
$('#resetFilters').addEventListener('click',()=>{$('#filterForm').reset();$('#filterForm').elements.minAge.value=18;$('#filterForm').elements.maxAge.value=99;loadDiscover();});
$('#profileCard').addEventListener('click',e=>{const action=e.target.closest('[data-card-action]')?.dataset.cardAction;if(!action)return;if(action==='like')likeCurrent();if(action==='pass')passCurrent();if(action==='safety'){const p=currentProfile();if(p)openSafety(p.id,p.display_name);}});

document.addEventListener('click',async e=>{
  const chat=e.target.closest('[data-chat]');if(chat)return openChat(chat.dataset.chat);
  if(e.target.closest('[data-go-discover]')){showScreen('discover');return loadDiscover();}
  const safety=e.target.closest('[data-match-safety]');if(safety){const m=state.matches.find(x=>Number(x.id)===Number(safety.dataset.matchSafety));if(m)openSafety(m.id,m.display_name);}
  const chatSafety=e.target.closest('[data-chat-safety]');if(chatSafety&&state.activeMatch)openSafety(state.activeMatch.id,state.activeMatch.display_name);
  const unmatch=e.target.closest('[data-unmatch]');if(unmatch){if(!confirm('Unmatch this person? The conversation will be removed.'))return;try{await api(`/api/matches/${unmatch.dataset.unmatch}`,{method:'DELETE'});state.activeMatch=null;toast('Unmatched.');showScreen('matches');await loadMatches();}catch(err){toast(err.message,'error');}}
  if(e.target.matches('[data-close-modal], .modal'))closeModals();
});

$('#chatBack').addEventListener('click',()=>{$('.chat-shell').classList.remove('chat-open');showScreen('matches');});
$('#chatForm').addEventListener('submit',async e=>{e.preventDefault();if(!state.activeMatch)return toast('Choose a conversation first.','error');const input=$('#chatInput'),body=input.value.trim();if(!body)return;input.value='';try{await api(`/api/messages/${state.activeMatch.match_id}`,{method:'POST',body:JSON.stringify({body})});await loadMessages();await loadMatches();}catch(err){input.value=body;toast(err.message,'error');}});

$('#profileForm').addEventListener('submit',async e=>{e.preventDefault();clearErrors(e.currentTarget);const p=formPayload(e.currentTarget);let ok=true;if(!p.displayName)ok=fieldError(e.currentTarget,'displayName','Add your display name.','profileDisplayName')&&ok;if(!p.country)ok=fieldError(e.currentTarget,'country','Choose your country.','profileCountry')&&ok;else if(!isCountry(p.country))ok=fieldError(e.currentTarget,'country','Choose a country from the list.','profileCountry')&&ok;if(!p.relationshipGoal)ok=fieldError(e.currentTarget,'relationshipGoal','Choose a relationship goal.','profileRelationshipGoal')&&ok;if(!p.bio)ok=fieldError(e.currentTarget,'bio','Write a short bio.','profileBio')&&ok;if(!(state.me?.photos?.length||state.me?.photo_url)){const el=document.querySelector('[data-error-for="profilePhotos"]');el.textContent='Add at least one photo.';el.classList.add('show');ok=false;}if(!ok)return;try{const saved=await api('/api/profile',{method:'PUT',body:JSON.stringify(p)});state.me=saved;hydrateForms(saved);toast('Profile saved ✓');}catch(err){toast(err.message,'error',4000);}});

$('#discoveryToggle').addEventListener('change',async e=>{try{await api('/api/settings/discovery',{method:'PUT',body:JSON.stringify({enabled:e.target.checked})});state.me.discovery_enabled=e.target.checked;toast(e.target.checked?'You are visible in Discover.':'Discovery paused.');}catch(err){e.target.checked=!e.target.checked;toast(err.message,'error');}});
$('#passwordForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,b=$('button[type="submit"]',f);b.disabled=true;try{await api('/api/password',{method:'PUT',body:JSON.stringify(formPayload(f))});f.reset();toast('Password updated ✓');}catch(err){toast(err.message,'error',4000);}finally{b.disabled=false;}});
$('#deleteAccountBtn').addEventListener('click',async()=>{if(!confirm('Delete your VOWSI account permanently? This cannot be undone.'))return;if(!confirm('Final confirmation: delete all profile, match and message data?'))return;try{await api('/api/account',{method:'DELETE'});stopPolling();state.me=null;showScreen('landing');toast('Account deleted.');}catch(err){toast(err.message,'error');}});

$('#reportBtn').addEventListener('click',async()=>{if(!state.safetyTarget)return;const reason=$('#reportReason').value.trim();if(!reason)return toast('Choose a report reason.','error');try{await api(`/api/report/${state.safetyTarget}`,{method:'POST',body:JSON.stringify({reason})});closeModals();toast('Report submitted. Thank you.');}catch(err){toast(err.message,'error');}});
$('#blockBtn').addEventListener('click',async()=>{if(!state.safetyTarget)return;if(!confirm('Block this person? They will no longer appear to you.'))return;try{await api(`/api/block/${state.safetyTarget}`,{method:'POST'});closeModals();toast('Person blocked.');if(state.screen==='discover')loadDiscover();else{showScreen('matches');loadMatches();}}catch(err){toast(err.message,'error');}});
$('#matchMessageBtn').addEventListener('click',async e=>{const id=e.currentTarget.dataset.matchId;closeModals();await loadMatches();openChat(id);});

initCountries();
bootstrap();
