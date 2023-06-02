import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

const pages = import.meta.glob<true, string, { default: FunctionComponent }>(
  '../pages/**/index.tsx',
  { eager: true },
);

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\/index\.tsx$/)?.[1]!;
  return {
    name,
    path: name === 'Bot' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  };
});

export default () => {
  return (
    <Routes>
      {routes.map(({ path, component: RouteComp }) => {
        return <Route key={path} path={path} element={<RouteComp />}></Route>;
      })}
    </Routes>
  );
};
