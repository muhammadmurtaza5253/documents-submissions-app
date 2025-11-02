import SnackbarProvider from "../contexts/SnackbarProvider";

export const withProviders = (Component: React.ComponentType) => {
  const WrappedComponent = (props: React.ComponentProps<typeof Component>) => (
    <SnackbarProvider>
      <Component {...props} />
    </SnackbarProvider>
  );
  
  WrappedComponent.displayName = `withProviderComponent ${Component.displayName || Component.name || 'Component'}`;
  
  return WrappedComponent;
};
