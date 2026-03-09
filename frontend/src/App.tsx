import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { routeList } from "./routes";
import { LazyComponentLoader } from "./routes/lazy-component-loader";
import { AuthProvider } from "./context/auth-provider";
import { Toaster } from "sileo";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {routeList.map((route, index) => {
            if (route.redirect) {
              return (
                <Route
                  key={index}
                  path={route.route()}
                  Component={() => (
                    <Navigate
                      to={
                        route.redirect as string
                      }
                      replace={true}
                    />
                  )}
                />
              );
            }

            return (
              <Route
                key={index}
                path={route.route()}
                Component={() => (
                  <LazyComponentLoader
                    route={route}
                  />
                )}
              />
            );
          })}
        </Routes>

      </AuthProvider>
      <Toaster position="top-center" options={{
        fill: "#171717",
        roundness: 16,
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/10!",
          button: "bg-white/10! hover:bg-white/15!",
        },
      }} />
    </BrowserRouter>
  )
}
