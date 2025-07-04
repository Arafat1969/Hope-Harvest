// src/__mocks__/react-router-dom.js
const React = require("react");

function makeAnchor({ children, to, className, ...rest }) {
  // ensure className is a string
  const cn = Array.isArray(className) ? className.join(" ") : className;
  return (
    <a href={to} className={cn} {...rest}>
      {children}
    </a>
  );
}

module.exports = {
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,

  Link: (props) => makeAnchor(props),
  NavLink: (props) => makeAnchor(props),

  useNavigate: () => () => {},
  useLocation: () => ({ pathname: "/" }),
};
