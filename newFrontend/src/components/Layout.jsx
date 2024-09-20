import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* Common Header/Nav */}
      {/* <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/subject/math">Math</Link></li>
            <li><Link to="/subject/science">Science</Link></li>
          </ul>
        </nav>
      </header> */}

      {/* Main content area where the child routes will be rendered */}
      <main>
        <Outlet /> {/* This renders the child routes */}
      </main>

      {/* Common Footer */}
      <footer>
        <p>© 2024 My App</p>
      </footer>
    </div>
  );
}

export default Layout;
