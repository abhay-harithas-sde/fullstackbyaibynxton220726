import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import './site-chrome.css';

export function ProHeader(){return <header className="pro-header"><Link to="/" aria-label="CareerPilot AI home"><BrandLogo/></Link><nav aria-label="Public navigation"><a href="#how-it-works">How it works</a><a href="#ai-coach">AI coach</a><a href="#features">Why CareerPilot</a></nav><div className="pro-header-actions"><Link className="nav-login" to="/login">Sign in</Link><Link className="nav-join" to="/register">Get started <span>→</span></Link></div></header>}

export function ProFooter(){return <footer className="pro-footer"><div className="footer-top"><div><BrandLogo/><p>Practice with clarity. Show up with confidence.</p></div><div className="footer-links"><div><b>Product</b><a href="#how-it-works">How it works</a><a href="#ai-coach">AI coaching</a><a href="#features">Features</a></div><div><b>Start here</b><Link to="/register">Create account</Link><Link to="/login">Sign in</Link><Link to="/interview/new">Mock interview</Link></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} CareerPilot AI</span><span>Built for students who are building their future.</span><span className="footer-secure">✦ Your practice stays private</span></div></footer>}
