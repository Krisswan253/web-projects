// public/script.js
// Week 05–06: load all messages, render tiles, support delete by id

async function getMessages() {
  try {
    const res = await fetch('/all-messages');
    const json = await res.json();
    renderFeed(json.messages || []);
  } catch (err) {
    console.error('Failed to load messages', err);
  }
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function renderFeed(messages) {
  const feed = document.getElementById('feed');
  if (!feed) return;

  feed.innerHTML = '';

  if (!messages.length) {
    const empty = el('div', { class: 'pad' });
    empty.textContent = 'No posts yet — file a theft report above.';
    feed.appendChild(empty);
    return;
  }

  // newest first by postNumber
  const sorted = [...messages].sort((a, b) => Number(b.postNumber) - Number(a.postNumber));

  for (const n of sorted) {
    const card = el('div', { class: 'cardlet' });

    // optional image
    if (n?.media?.image) {
      const img = el('img', { src: n.media.image, alt: (n.caption || n.message || 'evidence image') });
      card.appendChild(img);
    }

    const pad = el('div', { class: 'pad' });

    const dateText = n.date || '';
    const who = n.offender || n.username || '';
    const bodyText = n.caption || n.message || n.text || '';

    const meta = el('div', { class: 'meta', text: dateText });
    const offender = el('div', { class: 'offender', text: who ? `@${who}` : '(anonymous)' });
    const caption = el('div', { class: 'caption', text: bodyText });

    // Actions
    const actions = el('div', { class: 'actions' });
    const delBtnId = `postNum-${n.postNumber}`;
    const del = el('button', { class: 'delete', id: delBtnId, type: 'button', text: 'Delete' });
    actions.appendChild(del);

    pad.appendChild(meta);
    pad.appendChild(offender);
    pad.appendChild(caption);
    pad.appendChild(actions);
    card.appendChild(pad);
    feed.appendChild(card);

    // DELETE /delete/:id
    document.getElementById(delBtnId)?.addEventListener('click', async () => {
      try {
        const resp = await fetch(`/delete/${n.postNumber}`, { method: 'DELETE' });
        if (!resp.ok) {
          const err = await resp.text();
          console.error('Delete failed:', err);
          alert('Delete failed. Check server logs.');
          return;
        }
        card.remove();
      } catch (e) {
        console.error(e);
        alert('Network issue deleting post.');
      }
    });
  }
}

// kick off
document.addEventListener('DOMContentLoaded', getMessages);
