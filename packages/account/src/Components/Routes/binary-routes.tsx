import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

import getRoutesConfig from '../../Constants/routes-config';
import { TBinaryRoutes, TRoute } from '../../Types';

import RouteWithSubRoutes from './route-with-sub-routes';

const BinaryRoutes = observer((props: TBinaryRoutes) => {
    const { common } = useStore();
    const { current_language } = common;
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {/* Redirect from / to /bot */}
                <Route exact path="/" render={() => <Redirect to="/bot" />} />
                {/* Render your defined routes */}
                {getRoutesConfig().map((route: TRoute, idx: number) => (
                    <RouteWithSubRoutes key={`${idx}_${current_language}`} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;