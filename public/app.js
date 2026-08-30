const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let me = null;
let activeMatch = null;

async function api(url, opts = {}) {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

function go(id) {
  $$(".view").forEach((v) => v.classList.add("hidden"));

  const page = $("#" + id);
  if (page) page.classList.remove("hidden");

  if (id === "discover") loadDiscover();
  if (id === "matches") loadMatches();
  if (id === "profile") loadProfile();
}

$$("[data-go]").forEach((b) => {
  b.onclick = () => go(b.dataset.go);
});

/* -------------------------
   SIGN UP
------------------------- */

$("#signupForm").onsubmit = async (e) => {
  e.preventDefault();

  const form = Object.fromEntries(new FormData(e.target));

  try {
    await api("/api/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });

    await bootstrap();
    go("profile");
  } catch (err) {
    $("#signupMsg").textContent = err.message;
  }
};

/* -------------------------
   LOGIN
------------------------- */

$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();

  const form = Object.fromEntries(new FormData(e.target));

  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    await bootstrap();
    go("discover");
  } catch (err) {
    $("#loginMsg").textContent = err.message;
  }
};

/* -------------------------
   LOGOUT
------------------------- */

$("#logout").onclick = async () => {
  await api("/api/logout", {
    method: "POST",
  });

  me = null;
  go("home");
};

/* -------------------------
   CURRENT USER
------------------------- */

async function bootstrap() {
  try {
    me = await api("/api/me");
    $("#logout").style.display = "inline-block";
  } catch {
    me = null;
    $("#logout").style.display = "none";
  }
}

/* -------------------------
   PROFILE
------------------------- */

async function loadProfile() {
  if (!me) {
    go("login");
    return;
  }

  const profile = await api("/api/me");
  const form = $("#profileForm");

  const values = {
    displayName: profile.display_name,
    country: profile.country,
    city: profile.city,
    languages: profile.languages,
    relationshipGoal: profile.relationship_goal,
    bio: profile.bio,
    photoUrl: profile.photo_url,
  };

  for (const [key, value] of Object.entries(values)) {
    if (form.elements[key]) {
      form.elements[key].value = value || "";
    }
  }
}

$("#profileForm").onsubmit = async (e) => {
  e.preventDefault();

  try {
    const form = Object.fromEntries(new FormData(e.target));

    await api("/api/profile", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    $("#profileMsg").textContent = "Profile saved.";
  } catch (err) {
    $("#profileMsg").textContent = err.message;
  }
};

/* -------------------------
   DISCOVER
------------------------- */

async function loadDiscover() {
  if (!me) {
    go("login");
    return;
  }

  try {
    const people = await api("/api/discover");

    if (!people.length) {
      $("#people").innerHTML = `
        <div class="card">
          <h3>No profiles yet</h3>
          <p>
            VOWSI never invents fake members.
            Invite real founding members and check back soon.
          </p>
        </div>
      `;

      return;
    }

    $("#people").innerHTML = people
      .map(
        (person) => `
        <article class="person">

          <div class="photo">
            ${
              person.photo_url
                ? `<img src="${esc(person.photo_url)}" alt="">`
                : esc(person.display_name?.[0] || "V")
            }
          </div>

          <div class="pad">

            <h3>
              ${esc(person.display_name)}, ${person.age}
            </h3>

            <div>
              ${esc(
                person.city
                  ? person.city + ", " + person.country
                  : person.country
              )}
            </div>

            <p>
              ${esc(person.relationship_goal || "")}
            </p>

            <p>
              ${esc(person.bio || "")}
            </p>

            <div class="actions">

              <button
                class="secondary"
                onclick="blockUser(${person.id})"
              >
                Block
              </button>

              <button
                class="primary"
                onclick="likeUser(${person.id}, this)"
              >
                Like
              </button>

            </div>

          </div>
        </article>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

/* -------------------------
   LIKE
------------------------- */

window.likeUser = async (id, button) => {
  try {
    const result = await api("/api/like/" + id, {
      method: "POST",
    });

    button.textContent = result.matched
      ? "Matched!"
      : "Liked";

    button.disabled = true;

    if (result.matched) {
      alert("It's a match!");
    }
  } catch (err) {
    alert(err.message);
  }
};

/* -------------------------
   BLOCK
------------------------- */

window.blockUser = async (id) => {
  const confirmed = confirm(
    "Block this member?"
  );

  if (!confirmed) return;

  try {
    await api("/api/block/" + id, {
      method: "POST",
    });

    loadDiscover();
  } catch (err) {
    alert(err.message);
  }
};

/* -------------------------
   MATCHES
------------------------- */

async function loadMatches() {
  if (!me) {
    go("login");
    return;
  }

  try {
    const matches = await api("/api/matches");

    if (!matches.length) {
      $("#matchList").innerHTML =
        "<p>No matches yet.</p>";

      return;
    }

    $("#matchList").innerHTML = matches
      .map(
        (match) => `
        <article class="person">

          <div class="photo">

            ${
              match.photo_url
                ? `<img src="${esc(match.photo_url)}" alt="">`
                : esc(match.display_name?.[0] || "V")
            }

          </div>

          <div class="pad">

            <h3>
              ${esc(match.display_name)}
            </h3>

            <p>
              ${esc(match.country)}
            </p>

            <button
              class="primary"
              onclick="openChat(
                ${match.match_id},
                '${esc(match.display_name)}'
              )"
            >
              Chat
            </button>

          </div>

        </article>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

/* -------------------------
   OPEN CHAT
------------------------- */

window.openChat = async (
  matchId,
  name
) => {
  activeMatch = matchId;

  $("#chat").classList.remove("hidden");

  $("#chatTitle").textContent =
    "Chat with " + name;

  await loadMessages();
};

/* -------------------------
   LOAD MESSAGES
------------------------- */

async function loadMessages() {
  if (!activeMatch) return;

  try {
    const messages = await api(
      "/api/messages/" + activeMatch
    );

    $("#messages").innerHTML = messages
      .map(
        (message) => `
        <div
          class="msg ${
            message.sender_id === me.id
              ? "mine"
              : ""
          }"
        >

          <strong>
            ${esc(message.sender)}:
          </strong>

          ${esc(message.body)}

        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

/* -------------------------
   SEND MESSAGE
------------------------- */

$("#messageForm").onsubmit = async (e) => {
  e.preventDefault();

  if (!activeMatch) return;

  const body =
    e.target.body.value.trim();

  if (!body) return;

  try {
    await api(
      "/api/messages/" + activeMatch,
      {
        method: "POST",
        body: JSON.stringify({
          body,
        }),
      }
    );

    e.target.reset();

    await loadMessages();
  } catch (err) {
    alert(err.message);
  }
};

/* -------------------------
   ESCAPE HTML
------------------------- */

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]
  );
}

/* -------------------------
   START VOWSI
------------------------- */

bootstrap();
