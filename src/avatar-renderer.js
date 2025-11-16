export function renderAvatar(element, user, userSettings, options = {}) {
    if (!element) return;

    const { size = 'normal', extraClasses = [] } = options;
    const avatarData = user === 'user1' ? userSettings.avatars?.user1 : userSettings.avatars?.user2;
    const initial = user === 'user1' ? 'J' : 'E';

    const colorMap = {
        blue: '#3b82f6',
        red: '#ef4444',
        yellow: '#f59e0b',
        purple: '#8b5cf6',
        green: '#22c55e',
    };

    // Base classes
    const sizeClasses = size === 'small' ? ['w-6', 'h-6', 'text-sm'] : ['w-10', 'h-10', 'text-xl'];
    const baseClasses = [...sizeClasses, 'rounded-full', 'flex', 'items-center', 'justify-center', 'font-bold', 'text-white', 'overflow-hidden', 'relative'];
    element.className = [...baseClasses, ...extraClasses].join(' ');

    // Clear previous styles and content
    element.innerHTML = '';
    element.style.backgroundImage = '';
    // Also remove any old gradient classes
    const gradientClasses = Array.from(element.classList).filter(c => c.startsWith('avatar-gradient-'));
    element.classList.remove(...gradientClasses);


    if (avatarData && typeof avatarData === 'object' && avatarData.color1 && avatarData.color2) {
        // New avatar system with custom gradients and icons
        const color1 = colorMap[avatarData.color1] || avatarData.color1;
        const color2 = colorMap[avatarData.color2] || avatarData.color2;
        element.style.backgroundImage = `linear-gradient(to right, ${color1}, ${color2})`;

        if (avatarData.icon) {
            element.innerHTML = `<img src="/avatars/${avatarData.icon}" class="absolute inset-0 w-full h-full object-cover p-2" />`;
        } else {
            element.textContent = initial;
        }
    } else if (typeof avatarData === 'string' && avatarData.startsWith('avatar-gradient-')) {
        // Old avatar system (fallback for existing settings)
        element.classList.add(avatarData);
        element.textContent = initial;
    } else {
        // Default avatar
        element.textContent = initial;
        element.style.backgroundColor = '#4b5563'; // A default background color
    }
}
