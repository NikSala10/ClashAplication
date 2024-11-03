import './screens/register';
import './screens/login'
import './screens/dahsboard';
import './screens/account';
import { addObserver, appState } from './store/store';
import { Screens } from './types/store';

class AppContainer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		addObserver(this);
	}

	connectedCallback() {
		this.render();
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = '';
			switch (appState.screen) {
				case Screens.REGISTER:
					const register = this.ownerDocument.createElement('app-register');
					this.shadowRoot.appendChild(register);
					break;

				case Screens.LOGIN:
					const login = this.ownerDocument.createElement('app-login');
					this.shadowRoot.appendChild(login);
					break;

				case Screens.DASHBOARD:
					const dashboard = this.ownerDocument.createElement('app-dashboard');
					this.shadowRoot.appendChild(dashboard);
					break;
				case Screens.ACCOUNT:
					const account = this.ownerDocument.createElement('app-account');
					this.shadowRoot.appendChild(account);
					break;

				default:
					break;
			}
		}
	}
}

customElements.define('app-container', AppContainer);
export default AppContainer