class AvatarPicker {
    constructor(onSelect) {
        this.onSelect = onSelect;
        this.colors = ['blue', 'red', 'yellow', 'purple', 'green', 'orange', 'teal'];
        this.icons = ['cat.png', 'headphones.png', 'sofa.png', 'spider.png', 'ticket.png'];
        this.selectedUser = null;
        this.selectedColor1 = null;
        this.selectedColor2 = null;
        this.selectedIcon = null;
        this.init();
    }

    init() {
        const container = document.createElement('div');
        container.id = 'avatar-picker-modal';
        container.className = 'fixed inset-0 z-[70] hidden items-center justify-center modal-hidden p-4';
        container.innerHTML = `
            <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50"></div>
            <div class="bg-bg-secondary rounded-lg shadow-xl z-50 w-full max-w-sm mx-auto overflow-hidden modal-content relative">
                <button id="avatar-picker-close-btn" class="absolute top-3 right-3 text-text-primary hover:text-accent-primary transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div class="p-6">
                    <h2 class="text-xl font-bold mb-4 text-center">Choose Avatar</h2>

                    <div id="avatar-preview" class="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-white text-4xl overflow-hidden bg-gray-700 relative">
                        <span id="avatar-preview-initial"></span>
                        <img id="avatar-preview-icon" src="" class="absolute inset-0 w-full h-full object-cover hidden p-2" />
                    </div>

                    <div class="space-y-6">
                        <div>
                            <h3 class="text-md font-semibold mb-2">1. Select User</h3>
                            <div class="flex gap-2">
                                <button id="avatar-user1-btn" class="user-btn flex-1 p-2 rounded-lg border-2 border-border-primary hover:border-accent-primary transition">Juainny</button>
                                <button id="avatar-user2-btn" class="user-btn flex-1 p-2 rounded-lg border-2 border-border-primary hover:border-accent-primary transition">Erick</button>
                            </div>
                        </div>

                        <div id="avatar-customization-section" class="hidden space-y-6">
                            <div>
                                <h3 class="text-md font-semibold mb-2">2. Select Colors</h3>
                                <div class="flex gap-4">
                                    <div id="color-picker-1" class="flex-1 space-y-1">
                                        <label class="text-xs text-text-muted">Color 1</label>
                                        <div class="grid grid-cols-3 gap-2">
                                            ${this.colors.map(c => `<div data-color="${c}" class="color-option h-6 w-6 rounded-full cursor-pointer bg-${c}-500 border-2 border-transparent hover:border-white"></div>`).join('')}
                                        </div>
                                    </div>
                                    <div id="color-picker-2" class="flex-1 space-y-1">
                                        <label class="text-xs text-text-muted">Color 2</label>
                                        <div class="grid grid-cols-3 gap-2">
                                            ${this.colors.map(c => `<div data-color="${c}" class="color-option h-6 w-6 rounded-full cursor-pointer bg-${c}-500 border-2 border-transparent hover:border-white"></div>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 class="text-md font-semibold mb-2">3. Select Icon</h3>
                                <div id="icon-picker" class="flex flex-wrap gap-2">
                                    <div data-icon="initial" class="icon-option w-10 h-10 rounded-lg cursor-pointer border-2 border-transparent flex items-center justify-center text-xl font-bold bg-gray-700 hover:border-white"></div>
                                    ${this.icons.map(i => `<div data-icon="${i}" class="icon-option w-10 h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-white"><img src="/avatars/${i}" class="w-full h-full object-cover p-1"></div>`).join('')}
                                </div>
                            </div>

                            <button id="save-avatar-btn" class="w-full bg-accent-primary hover:opacity-80 text-text-primary font-bold py-2 px-4 rounded-lg transition disabled:opacity-50" disabled>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        this.modal = container;
        this.customizationSection = this.modal.querySelector('#avatar-customization-section');
        this.colorPicker1 = this.modal.querySelector('#color-picker-1');
        this.colorPicker2 = this.modal.querySelector('#color-picker-2');
        this.iconPicker = this.modal.querySelector('#icon-picker');
        this.saveBtn = this.modal.querySelector('#save-avatar-btn');
        this.preview = this.modal.querySelector('#avatar-preview');
        this.previewInitial = this.modal.querySelector('#avatar-preview-initial');
        this.previewIcon = this.modal.querySelector('#avatar-preview-icon');

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.modal.querySelector('.modal-backdrop').addEventListener('click', () => this.close());
        this.modal.querySelector('#avatar-picker-close-btn').addEventListener('click', () => this.close());
        this.modal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());

        this.modal.querySelector('#avatar-user1-btn').addEventListener('click', () => this.selectUser('user1'));
        this.modal.querySelector('#avatar-user2-btn').addEventListener('click', () => this.selectUser('user2'));

        this.colorPicker1.addEventListener('click', (e) => this.handleColorSelect(e, 1));
        this.colorPicker2.addEventListener('click', (e) => this.handleColorSelect(e, 2));
        this.iconPicker.addEventListener('click', (e) => this.handleIconSelect(e));
        this.saveBtn.addEventListener('click', () => this.saveSelection());
    }

    selectUser(user) {
        this.selectedUser = user;
        const user1Btn = this.modal.querySelector('#avatar-user1-btn');
        const user2Btn = this.modal.querySelector('#avatar-user2-btn');
        const initial = user === 'user1' ? 'J' : 'E';

        if (user === 'user1') {
            user1Btn.classList.add('border-accent-primary');
            user2Btn.classList.remove('border-accent-primary');
        } else {
            user2Btn.classList.add('border-accent-primary');
            user1Btn.classList.remove('border-accent-primary');
        }
        this.iconPicker.querySelector('[data-icon="initial"]').textContent = initial;
        this.previewInitial.textContent = initial;
        this.customizationSection.classList.remove('hidden');
        this.resetSelections();
        this.updatePreview();
    }

    handleColorSelect(e, picker) {
        const colorOption = e.target.closest('.color-option');
        if (colorOption) {
            const color = colorOption.dataset.color;
            if (picker === 1) {
                this.selectedColor1 = color;
                this.updateSelected(this.colorPicker1, colorOption);
            } else {
                this.selectedColor2 = color;
                this.updateSelected(this.colorPicker2, colorOption);
            }
            this.checkSaveButton();
            this.updatePreview();
        }
    }

    handleIconSelect(e) {
        const iconOption = e.target.closest('.icon-option');
        if (iconOption) {
            this.selectedIcon = iconOption.dataset.icon;
            this.updateSelected(this.iconPicker, iconOption);
            this.checkSaveButton();
            this.updatePreview();
        }
    }

    updateSelected(container, selectedElement) {
        container.querySelectorAll('.border-accent-primary').forEach(el => el.classList.remove('border-accent-primary'));
        selectedElement.classList.add('border-accent-primary');
    }

    checkSaveButton() {
        if (this.selectedUser && this.selectedColor1 && this.selectedColor2 && this.selectedIcon) {
            this.saveBtn.disabled = false;
        } else {
            this.saveBtn.disabled = true;
        }
    }

    updatePreview() {
        const colorMap = { blue: '#3b82f6', red: '#ef4444', yellow: '#f59e0b', purple: '#8b5cf6', green: '#22c55e', orange: '#f97316', teal: '#14b8a6' };
        const color1 = colorMap[this.selectedColor1] || '#4b5563';
        const color2 = colorMap[this.selectedColor2] || color1;
        this.preview.style.backgroundImage = `linear-gradient(to right, ${color1}, ${color2})`;

        if (this.selectedIcon && this.selectedIcon !== 'initial') {
            this.previewIcon.src = `/avatars/${this.selectedIcon}`;
            this.previewIcon.classList.remove('hidden');
            this.previewInitial.classList.add('hidden');
        } else {
            this.previewIcon.classList.add('hidden');
            this.previewInitial.classList.remove('hidden');
        }
    }

    saveSelection() {
        if (!this.saveBtn.disabled) {
            const avatarData = {
                color1: this.selectedColor1,
                color2: this.selectedColor2,
                icon: this.selectedIcon === 'initial' ? null : this.selectedIcon,
            };
            this.onSelect(this.selectedUser, avatarData);
            this.close();
        }
    }

    resetSelections() {
        this.selectedColor1 = null;
        this.selectedColor2 = null;
        this.selectedIcon = null;
        this.colorPicker1.querySelectorAll('.border-accent-primary').forEach(el => el.classList.remove('border-accent-primary'));
        this.colorPicker2.querySelectorAll('.border-accent-primary').forEach(el => el.classList.remove('border-accent-primary'));
        this.iconPicker.querySelectorAll('.border-accent-primary').forEach(el => el.classList.remove('border-accent-primary'));
        this.checkSaveButton();
        this.updatePreview();
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    open() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.modal.classList.remove('hidden');
        setTimeout(() => this.modal.classList.remove('modal-hidden'), 10);
        this.customizationSection.classList.add('hidden');
        this.selectedUser = null;
        this.modal.querySelector('#avatar-user1-btn').classList.remove('border-accent-primary');
        this.modal.querySelector('#avatar-user2-btn').classList.remove('border-accent-primary');
        this.resetSelections();
    }

    close() {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.modal.classList.add('modal-hidden');
        setTimeout(() => this.modal.classList.add('hidden'), 300);
    }
}

export default AvatarPicker;
