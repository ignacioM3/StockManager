
const appLayoutImport = async () =>
    (await import('../layout/PublicLayout')).PublicLayout

export const publicRoutes = {
    login: {
        route: () => "/",
        page: async () => (await import('../pages/auth/Login')).Login,
        layout: appLayoutImport
    }
}