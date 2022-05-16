import {getRequest} from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    getRequest('/menu/menu').then(data => {
        if (data) {
            //格式化Router
            let fmtRoutes = formatRoutes(data);
            //添加到router
            router.addRoutes(fmtRoutes);
            //将数据存入vuex
            store.commit('initRoutes', fmtRoutes);
        }
    })

}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            children,
        } = router;
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children);
        }

        let fmRouter = {
            path: path,
            name: name,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Per')) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith('Tea')) {
                    require(['../views/tea/' + component + '.vue'], resolve);
                } else if (component.startsWith('Stu')) {
                    require(['../views/stu/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sub')) {
                    require(['../views/sub/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter);
    })
    return fmtRoutes;
}