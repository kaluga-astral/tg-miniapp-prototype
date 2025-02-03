export const APP_ROUTES = {
  cart: {
    route: '/cart',
    getRedirectPath() {
      return '/cart';
    },
  },
  books: {
    route: '/',
    getRedirectPath() {
      return '/';
    },
  },
  readingBook: {
    route: '/book/:id/read',
    getRedirectPath(id: string) {
      return `/book/${id}/read`;
    },
  },
  createBook: {
    route: '/admin/createBook',
    getRedirectPath() {
      return '/admin/createBook';
    },
  },
} as const;
