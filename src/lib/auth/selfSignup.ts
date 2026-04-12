export function isSelfSignupAllowed() {
    const configured = process.env.ALLOW_SELF_SIGNUP?.trim().toLowerCase();
    if (configured === 'true') return true;
    if (configured === 'false') return false;
    return process.env.NODE_ENV !== 'production';
}
