import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import getRoutesConfig from '../../Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';
import { getPositionsV2TabIndexFromURL, routes } from '@deriv/shared';
import { useDtraderV2Flag } from '@deriv/hooks';
import { TRoute } from '../../Types';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    [key: string]: unknown;
};

const BinaryRoutes = observer((props: TBinaryRoutesProps) => {
    const { gtm } = useStore();
    const { pushDataLayer } = gtm;
    const location = useLocation();
    const { dtrader_v2_enabled_mobile, dtrader_v2_enabled_desktop } = useDtraderV2Flag();

    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const getLoader = () => {
        if (dtrader_v2_enabled_mobile || dtrader_v2_enabled_desktop)
            return (
                <Loading.DTraderV2
                    initial_app_loading
                    is_contract_details={location.pathname.startsWith('/contract/')}
                    is_positions={location.pathname === routes.trader_positions}
                    is_closed_tab={getPositionsV2TabIndexFromURL() === 1}
                />
            );
        return <Loading />;
    };

    return (
        <React.Suspense fallback={getLoader()}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/bot" />} />
                {getRoutesConfig().map((route: TRoute, idx: number) => (
                    <RouteWithSubRoutes
                        key={idx}
                        {...route}
                        {...props}
                        is_logged_in={props.is_logged_in}
                        is_logging_in={props.is_logging_in}
                    />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;
