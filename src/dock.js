/**
 * dock.js — Cross-site app-switcher Dock (vanilla JS, no React)
 * Injects a fixed bottom-center dock with animated expand/collapse.
 *
 * Usage:
 *   import { initDock } from './dock.js';
 *   initDock('watchlist'); // pass active app id
 */

const DOCK_ITEMS = [
    {
        id: 'kino',
        label: 'Kino',
        href: 'https://kino.juainny.com',
        img: '/public/K.png',
        color: '#7C3AED',
    },
    {
        id: 'watchlist',
        label: 'Watchlist',
        href: 'https://watchlist.juainny.com',
        img: '/public/favicon.ico',
        color: '#EA580C',
    },
    {
        id: 'mm',
        label: 'MM',
        href: 'https://mm.juainny.com',
        img: '/dist/icon_old.png',
        color: '#1D4ED8',
    },
];

let isOpen = false;
let dockEl = null;

function buildDockHTML(activeId) {
    return `
    <div id="app-dock" style="
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    ">
      <!-- Toggle button (collapsed state) -->
      <div id="dock-collapsed" style="display:flex;align-items:center;justify-content:center;">
        <button id="dock-toggle-btn" title="App Switcher" style="
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          transition: background 0.2s, transform 0.3s;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        ">
          <i class="fas fa-th"></i>
        </button>
      </div>

      <!-- Expanded dock bar -->
      <div id="dock-expanded" style="
        display: none;
        align-items: center;
        gap: 12px;
        background: rgba(0,0,0,0.82);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 999px;
        padding: 10px 20px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.6);
        animation: dock-slide-up 0.2s cubic-bezier(0.4,0,0.2,1);
      ">
        ${DOCK_ITEMS.map(item => `
          <div class="dock-item-wrapper" style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <a
              href="${item.href}"
              class="dock-item"
              data-id="${item.id}"
              title="${item.label}"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: 14px;
                transition: transform 0.2s, box-shadow 0.2s;
                background: ${item.id === activeId ? item.color : 'rgba(255,255,255,0.06)'};
                box-shadow: ${item.id === activeId ? `0 0 16px ${item.color}66` : 'none'};
                overflow: hidden;
                text-decoration: none;
                cursor: pointer;
              "
            >
              <img
                src="${item.img}"
                alt="${item.label}"
                style="width:28px;height:28px;object-fit:contain;"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
              >
              <span style="
                display:none;
                color:white;
                font-weight:bold;
                font-size:14px;
                text-transform:uppercase;
              ">${item.label[0]}</span>
            </a>
            <!-- Tooltip -->
            <span style="
              position:absolute;
              top:-32px;
              left:50%;
              transform:translateX(-50%);
              background:rgba(0,0,0,0.9);
              color:white;
              font-size:11px;
              padding:3px 8px;
              border-radius:6px;
              white-space:nowrap;
              pointer-events:none;
              opacity:0;
              transition:opacity 0.15s;
              border:1px solid rgba(255,255,255,0.1);
            " class="dock-tooltip">${item.label}</span>
            ${item.id === activeId ? `<div style="
              width:4px;height:4px;border-radius:50%;
              background:white;margin-top:4px;
            "></div>` : ''}
          </div>
        `).join('')}

        <!-- Divider -->
        <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);margin:0 4px;"></div>

        <!-- Close button -->
        <button id="dock-close-btn" style="
          background:none;
          border:none;
          color:rgba(255,255,255,0.5);
          cursor:pointer;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:background 0.2s, color 0.2s;
          font-size:14px;
        ">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <style>
      @keyframes dock-slide-up {
        from { opacity: 0; transform: translateY(12px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
      }
      .dock-item:hover {
        transform: scale(1.12) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
      }
      .dock-item-wrapper:hover .dock-tooltip {
        opacity: 1 !important;
      }
      #dock-toggle-btn:hover {
        background: rgba(255,255,255,0.18) !important;
        transform: scale(1.08) !important;
      }
      #dock-close-btn:hover {
        background: rgba(255,255,255,0.1) !important;
        color: white !important;
      }
    </style>
  `;
}

function setOpen(open) {
    isOpen = open;
    const collapsed = document.getElementById('dock-collapsed');
    const expanded = document.getElementById('dock-expanded');
    if (!collapsed || !expanded) return;
    collapsed.style.display = open ? 'none' : 'flex';
    expanded.style.display = open ? 'flex' : 'none';
}

export function dockHide() {
    if (dockEl) dockEl.style.display = 'none';
}

export function dockShow() {
    if (dockEl) dockEl.style.display = '';
}

// Expose globally for player.js to call without an import
window.dockHide = dockHide;
window.dockShow = dockShow;

export function initDock(activeId = '') {
    // Inject a wrapper div into <body>
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildDockHTML(activeId);
    document.body.appendChild(wrapper);
    dockEl = document.getElementById('app-dock');

    // Toggle button
    const toggleBtn = document.getElementById('dock-toggle-btn');
    if (toggleBtn) toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!isOpen);
    });

    // Close button inside expanded
    const closeBtn = document.getElementById('dock-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(false);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (isOpen && !e.target.closest('#app-dock')) {
            setOpen(false);
        }
    });
}
