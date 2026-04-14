import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

/**
 * Custom render function that wraps components in Formik, Router, and QueryClient providers.
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  { initialValues = {}, initialEntries = ['/'], ...options } = {}
) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {ui}
        </Formik>
      </MemoryRouter>
    </QueryClientProvider>,
    options
  );
};
