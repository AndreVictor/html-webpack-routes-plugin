// Typically this kind of thing would come from a routing solution, not this hacky function

export function currentRoute() {

  const default_route = '/';

  if ( !canUseDOM() ) return default_route;

  const routes = [
    '/page1',
    '/page2',
  ];

  return routes.filter((route) => document.location.pathname.includes(route))[0] || default_route;

}


// https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/ExecutionEnvironment.js

export function canUseDOM() {
  return !!( typeof window !== 'undefined' && window.document && window.document.createElement );
}