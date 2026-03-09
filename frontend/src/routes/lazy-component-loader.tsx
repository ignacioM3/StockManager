import { useState, type FunctionComponent, type PropsWithChildren, useEffect } from "react";
import type { RouterDefinition } from "./routes-definition";
import { AuthGuard } from "../component/auth-guard";



interface Props {
    route: RouterDefinition;
}

export function LazyComponentLoader({ route }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [Page, setPage] = useState<FunctionComponent>();
    const [Layout, setLayout] =
        useState<FunctionComponent<PropsWithChildren>>();

    useEffect(() => {
        if (route.page) {
            route
                .page()
                .then((page) => {
                    setPage(() => page);
                })
                .then(() => {
                    if (route.layout) {
                        return route.layout().then((layout) => {
                            setLayout(() => layout);
                        });
                    }
                })
                .then(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return undefined;
    }

    if (Layout && Page) {
        return route.requiresAuth ? (
            <AuthGuard allowedRoles={route.allowedRoles}>
                <Layout>
                    <Page />
                </Layout>
            </AuthGuard>
        ) : (
            <Layout>
                <Page />
            </Layout>
        );
    } else if (Page) {
        return route.requiresAuth ? (
            <AuthGuard allowedRoles={route.allowedRoles}>
                <Page />
            </AuthGuard>
        ) : (
            <Page />
        );
    } else {
        return <div>Page not defined in route</div>;
    }
}
