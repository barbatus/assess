import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

const pages = import.meta.glob<true, string, { default: FunctionComponent }>(
  '../pages/**/*.page.tsx',
  { eager: true },
);

const routes = Object.keys(pages).map((path) => {
  const matches = path.match(/\.\/pages\/(.+)\/(?:\[(.*?)\])\.?page\.tsx$/);
  if (!matches) return null;
  return {
    path: matches[2] ? `/${matches[1]}/:${matches[2]}?` : `/${matches[1]}`,
    component: pages[path].default,
  };
}).filter(Boolean) as { path: string; component: FunctionComponent }[];

export default () => {
  return (
    <Routes>
      {routes.map(({ path, component: RouteComp }) => {
        return <Route key={path} path={path} element={<RouteComp />}></Route>;
      })}
    </Routes>
  );
};
