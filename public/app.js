const $ = (selector) => document.querySelector(selector);

let me = null;
let activeMatch = null;

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);

    if (!id) return;

    event.preventDefault();
    scrollToSection(id);

    if (id === "discover") loadDiscover();
    if (id === "matches") loadMatches();
    if (id === "profile") loadProfile();
  });
});


async function bootstrap() {
  try {
    me = await api("/api/me");
    $("#logoutBtn").classList.remove("hidden");
  } catch {
    me = null;
    $("#logoutBtn").classList.add("hidden");
  }
}

$("#signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = $("#signupMessage");
  message.textContent = "";

  const formData = new FormData(event.target);

  const payload = {
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    birthDate: formData.get("dateOfBirth"),
    country: formData.get("country")
  };

  try {
    await api("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    await bootstrap();

    message.textContent = "Account created successfully.";
    event.target.reset();

    await loadProfile();
    scrollToSection("profile");
  } catch (error) {
    message.textContent = error.message;
  }
});


$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = $("#loginMessage");
  message.textContent = "";

  const formData = new FormData(event.target);

  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    await bootstrap();

    message.textContent = "Signed in successfully.";
    event.target.reset();

    await loadDiscover();
    scrollToSection("discover");
  } catch (error) {
    message.textContent = error.message;
  }
});


$("#logoutBtn").addEventListener("click", async () => {
  try {
    await api("/api/logout", {
      method: "POST"
    });
  } catch {}

  me = null;
  activeMatch = null;

  $("#logoutBtn").classList.add("hidden");
  scrollToSection("signup");
});


async function loadProfile() {
  if (!me) return;

  try {
    const profile = await api("/api/me");
    const form = $("#profileForm");

    form.elements.displayName.value = profile.display_name || "";
    form.elements.country.value = profile.country || "";
    form.elements.city.value = profile.city || "";
    form.elements.languages.value = profile.languages || "";
    form.elements.relationshipGoal.value =
      profile.relationship_goal || "";
    form.elements.bio.value = profile.bio || "";
    form.elements.photoUrl.value = profile.photo_url || "";
  } catch (error) {
    $("#profileMessage").textContent = error.message;
  }
}


$("#profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!me) {
    $("#profileMessage").textContent =
      "Please sign in before saving your profile.";
    return;
  }

  const formData = new FormData(event.target);

  try {
    await api("/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        country: formData.get("country"),
        city: formData.get("city"),
        languages: formData.get("languages"),
        relationshipGoal: formData.get("relationshipGoal"),
        bio: formData.get("bio"),
        photoUrl: formData.get("photoUrl")
      })
    });

    $("#profileMessage").textContent = "Profile saved.";
    me = await api("/api/me");
  } catch (error) {
    $("#profileMessage").textContent = error.message;
  }
});


async function loadDiscover() {
  const container = $("#discoverGrid");

  if (!me) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♡</div>
        <h3>Sign in to discover people worldwide.</h3>
        <p>Create an account or sign in to start exploring VOWSI.</p>
      </div>
    `;
    return;
  }

  try {
    const people = await api("/api/discover");

    if (!people.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">♡</div>
          <h3>No profiles yet.</h3>
          <p>VOWSI only shows real members. New profiles will appear as people join.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = people.map((person) => `
      <article class="person-card">

        <div class="person-photo">
          ${
            person.photo_url
              ? `<img src="${escapeHtml(person.photo_url)}" alt="">`
              : `<div class="photo-placeholder">${escapeHtml(person.display_name?.[0] || "V")}</div>`
          }
        </div>

        <div class="person-content">
          <h3>
            ${escapeHtml(person.display_name)}
            ${person.age ? `, ${person.age}` : ""}
          </h3>

          <p>
            ${escapeHtml(
              person.city
                ? `${person.city}, ${person.country}`
                : person.country
            )}
          </p>

          <p>
            ${escapeHtml(person.relationship_goal || "")}
          </p>

          <p>
            ${escapeHtml(person.bio || "")}
          </p>

          <div class="person-actions">
            <button
              class="secondary-btn"
              onclick="blockUser(${person.id})"
            >
              Block
            </button>

            <button
              class="primary-btn"
              onclick="likeUser(${person.id}, this)"
            >
              Like
            </button>
          </div>
        </div>

      </article>
    `).join("");

  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Could not load profiles.</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}


window.likeUser = async (userId, button) => {
  try {
    const result = await api(`/api/like/${userId}`, {
      method: "POST"
    });

    button.disabled = true;
    button.textContent = result.matched ? "Matched!" : "Liked";

    if (result.matched) {
      await loadMatches();
    }
  } catch (error) {
    alert(error.message);
  }
};


window.blockUser = async (userId) => {
  const confirmed = confirm("Block this member?");

  if (!confirmed) return;

  try {
    await api(`/api/block/${userId}`, {
      method: "POST"
    });

    await loadDiscover();
  } catch (error) {
    alert(error.message);
  }
};


async function loadMatches() {
  const container = $("#matchesGrid");

  if (!me) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♡</div>
        <h3>Sign in to see your matches.</h3>
      </div>
    `;
    return;
  }

  try {
    const matches = await api("/api/matches");

    if (!matches.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">♡</div>
          <h3>No matches yet.</h3>
          <p>When you and another member like each other, your match will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = matches.map((match) => `
      <article class="person-card">

        <div class="person-photo">
          ${
            match.photo_url
              ? `<img src="${escapeHtml(match.photo_url)}" alt="">`
              : `<div class="photo-placeholder">${escapeHtml(match.display_name?.[0] || "V")}</div>`
          }
        </div>

        <div class="person-content">

          <h3>${escapeHtml(match.display_name)}</h3>

          <p>${escapeHtml(match.country || "")}</p>

          <button
            class="primary-btn"
            onclick="openChat(${match.match_id})"
          >
            Chat
          </button>

        </div>

      </article>
    `).join("");

  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Could not load matches.</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}


window.openChat = async (matchId) => {
  activeMatch = matchId;

  await loadMessages();

  scrollToSection("chat");
};


async function loadMessages() {
  if (!activeMatch) return;

  try {
    const messages = await api(`/api/messages/${activeMatch}`);

    const container = $("#chatMessages");

    if (!messages.length) {
      container.innerHTML = `
        <div class="empty-chat">
          No messages yet. Start the conversation.
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map((message) => `
      <div class="chat-message ${
        message.sender_id === me.id ? "mine" : ""
      }">
        <strong>${escapeHtml(message.sender)}</strong>
        <span>${escapeHtml(message.body)}</span>
      </div>
    `).join("");

    container.scrollTop = container.scrollHeight;

  } catch (error) {
    $("#chatMessages").innerHTML = `
      <div class="empty-chat">
        ${escapeHtml(error.message)}
      </div>
    `;
  }
}


$("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!me) {
    alert("Please sign in first.");
    return;
  }

  if (!activeMatch) {
    alert("Choose a match before sending a message.");
    return;
  }

  const input = $("#chatInput");
  const body = input.value.trim();

  if (!body) return;

  try {
    await api(`/api/messages/${activeMatch}`, {
      method: "POST",
      body: JSON.stringify({ body })
    });

    input.value = "";

    await loadMessages();
  } catch (error) {
    alert(error.message);
  }
});


bootstrap();

/* =========================================
   VOWSI APP SCREEN NAVIGATION
   ========================================= */

function showScreen(screenId) {
  if (!me) return;

  document.body.classList.add("app-mode");

  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active-screen");
  });

  const chatSection = document.querySelector("#chat");
  if (chatSection) {
    chatSection.classList.remove("active-screen");
  }

  const target = document.querySelector(screenId);

  if (target) {
    target.classList.add("active-screen");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screenId === "#discover") {
    loadDiscover();
  }

  if (screenId === "#matches") {
    loadMatches();
  }

  if (screenId === "#profile") {
    loadProfile();
  }
}


/* DISCOVER */
document.querySelectorAll('a[href="#discover"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!me) return;

    event.preventDefault();
    showScreen("#discover");
  });
});


/* MATCHES */
document.querySelectorAll('a[href="#matches"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!me) return;

    event.preventDefault();
    showScreen("#matches");
  });
});


/* PROFILE */
document.querySelectorAll('a[href="#profile"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!me) return;

    event.preventDefault();
    showScreen("#profile");
  });
});


/* OPEN CHAT AS ITS OWN SCREEN */
const originalOpenChat = openChat;

openChat = async function(matchId) {
  await originalOpenChat(matchId);

  document.body.classList.add("app-mode");

  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active-screen");
  });

  const chatSection = document.querySelector("#chat");

  if (chatSection) {
    chatSection.classList.add("active-screen");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};


/* AFTER LOGIN/SIGNUP, ENTER APP MODE */
function enterVowsiApp() {
  if (!me) return;

  document.body.classList.add("app-mode");

  const currentActive = document.querySelector(".active-screen");

  if (!currentActive) {
    showScreen("#discover");
  }
}


/* Check login state after bootstrap finishes */
setTimeout(() => {
  if (me) {
    enterVowsiApp();
  }
}, 700);
