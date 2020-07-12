import React from 'react';
import { FormattedMessage } from 'react-intl';
import imageSrc from 'assets/images/logo.png';
import { Link } from 'react-router-dom';
import Container from '../UI/Container/Container';
import './Header.module.scss';

const Header: React.FC = () => (
    <header className="header">
        <Container>
            <div className="header__content">
                <div>
                    <Link to="/">
                        <img className="header__logo" src={imageSrc} alt="Voety" />
                    </Link>
                </div>
                <nav className="nav">
                    <ul className="nav__list">
                        <li className="nav__list-item">
                            <Link to="/">
                                <FormattedMessage
                                    id="header.home"
                                    description="Homepage"
                                    defaultMessage="Home"
                                />
                            </Link>
                        </li>
                        <li className="nav__list-item">
                            <Link to="/lineup">
                                <FormattedMessage
                                    id="header.lineup"
                                    description="Lineup Builder"
                                    defaultMessage="Lineup Builder"
                                />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </Container>
    </header>
);

export default Header;
