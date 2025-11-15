import { renderAvatar } from './avatar-renderer.js';

class MoodModal {
  constructor(moods, onDone, userSettings) {
    this.moods = moods;
    this.onDone = onDone;
    this.userSettings = userSettings;
    this.selectedMood = null;
    this.selectedUser = null;
    this.modal = null;
    this.createModal();
  }

  createModal() {
    const moodModalContainer = document.getElementById('mood-modal-container');
    moodModalContainer.innerHTML = `
      <div class="mood-modal-overlay">
        <div class="mood-modal bg-bg-secondary text-text-primary">
          <button id="close-mood-modal-btn" class="absolute top-4 right-4 text-text-primary hover:text-accent-primary transition bg-white/10 backdrop-blur-sm rounded-full p-2 z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 class="text-2xl font-bold mb-6 text-center">How did this movie make you react?</h2>
          <div class="flex justify-center mb-6 gap-4">
            <button class="user-select-btn bg-bg-tertiary flex items-center gap-2" data-user="user1">
                <div class="w-8 h-8 rounded-full user1-avatar-preview"></div>
                <span>Juainny</span>
            </button>
            <button class="user-select-btn bg-bg-tertiary flex items-center gap-2" data-user="user2">
                <div class="w-8 h-8 rounded-full user2-avatar-preview"></div>
                <span>Erick</span>
            </button>
          </div>
          <div class="mood-grid">
            ${this.moods.map(mood => `
              <div class="mood-option" data-mood="${mood.name}" role="button" aria-label="${mood.name}">
                <img src="/moods/${mood.image}" alt="${mood.name}">
                <span class="mood-label">${mood.name}</span>
              </div>
            `).join('')}
          </div>
          <div class="mt-8 text-center">
            <button id="mood-done-btn" class="bg-accent-primary hover:bg-accent-secondary text-text-on-accent font-bold py-2 px-8 rounded-lg transition" disabled>Done</button>
          </div>
        </div>
      </div>
    `;

    this.modal = moodModalContainer.querySelector('.mood-modal-overlay');
    this.attachEventListeners();
    this.applyAvatars();
  }

  applyAvatars() {
      if (this.userSettings && this.userSettings.avatars) {
          const user1Avatar = this.modal.querySelector('.user1-avatar-preview');
          const user2Avatar = this.modal.querySelector('.user2-avatar-preview');
          renderAvatar(user1Avatar, 'user1', this.userSettings);
          renderAvatar(user2Avatar, 'user2', this.userSettings);
      }
  }

  attachEventListeners() {
    this.modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('mood-modal-overlay') || e.target.closest('#close-mood-modal-btn')) {
        this.close();
      }
    });

    const userSelectBtns = this.modal.querySelectorAll('.user-select-btn');
    userSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => this.selectUser(btn.dataset.user));
    });

    const moodOptions = this.modal.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
      option.addEventListener('click', () => this.selectMood(option.dataset.mood));
    });

    const doneBtn = this.modal.querySelector('#mood-done-btn');
    doneBtn.addEventListener('click', () => {
      if (this.selectedMood && this.selectedUser) {
        this.onDone(this.selectedUser, this.selectedMood);
        this.close();
      }
    });
  }

  selectUser(user) {
    this.selectedUser = user;
    const userSelectBtns = this.modal.querySelectorAll('.user-select-btn');
    userSelectBtns.forEach(btn => {
        btn.classList.remove('selected', 'user1-highlight', 'user2-highlight');
        if (btn.dataset.user === user) {
            btn.classList.add('selected');
            if (user === 'user1') {
                btn.classList.add('user1-highlight');
            } else {
                btn.classList.add('user2-highlight');
            }
        }
    });

    const moodOptions = this.modal.querySelectorAll('.mood-option img');
    moodOptions.forEach(img => {
        img.style.filter = 'grayscale(0%)';
    });

    this.checkDoneButtonState();
  }

  selectMood(moodName) {
    this.selectedMood = this.moods.find(m => m.name === moodName);
    const moodOptions = this.modal.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
      option.classList.toggle('selected', option.dataset.mood === moodName);
    });
    this.checkDoneButtonState();
  }

  checkDoneButtonState() {
    this.modal.querySelector('#mood-done-btn').disabled = !this.selectedMood || !this.selectedUser;
  }

  open(moods = {}) {
    this.selectedMood = null;
    this.selectedUser = null;

    const moodOptions = this.modal.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.classList.remove('selected', 'user1-glow', 'user2-glow');
        const moodName = option.dataset.mood;

        if (moods.user1 && moods.user1.name === moodName) {
            option.classList.add('user1-glow');
        }
        if (moods.user2 && moods.user2.name === moodName) {
            option.classList.add('user2-glow');
        }
        option.querySelector('img').style.filter = 'grayscale(100%)';
    });

    const userSelectBtns = this.modal.querySelectorAll('.user-select-btn');
    userSelectBtns.forEach(btn => {
        btn.classList.remove('selected', 'user1-highlight', 'user2-highlight');
    });

    this.modal.querySelector('#mood-done-btn').disabled = true;
    this.modal.classList.add('visible');
  }

  close() {
    this.modal.classList.remove('visible');
  }
}

export default MoodModal;
