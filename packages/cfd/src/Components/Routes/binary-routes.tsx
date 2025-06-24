import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import { TBinaryRoutes } from 'Types/types';

const BinaryRoutes = (props: TBinaryRoutes) => {
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/bot" />} />
                {getRoutesConfig().map((route, id) => (
                    <RouteWithSubRoutes key={id} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
