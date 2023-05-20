import React from 'react';

export default function Menu() {
  return (
    <>
        <header class="p-3 mb-3 border-bottom">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
                        <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle" />
                    </a>

                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <a href="www.google.com" class="nav-link px-2 link-secondary">Overview</a>
                        </li>
                    </ul>
                    <div class="dropdown text-end">
                        <a href="www.google.com" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle" />
                        </a>
                        <ul class="dropdown-menu text-small">
                            <li><a class="dropdown-item" href="www.google.com">New project...</a></li>
                            <li><hr class="dropdown-divider"/></li>
                            <li><a class="dropdown-item" href="www.google.com">Sign out</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    </>

  );
};