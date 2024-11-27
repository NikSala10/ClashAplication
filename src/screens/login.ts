import { dispatch } from '../store/store';
import { navigate } from '../store/actions';
import { Screens } from '../types/store';
import { loginUser } from '../utils/firebase';
import styles from './login.css'

const credentials = {
	email: '',
	password: '',
};

class Login extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	changeEmail(e: any) {
		credentials.email = e.target.value;
	}

	changePassword(e: any) {
		credentials.password = e.target.value;
	}

	async submitForm() {
		try {
			const isAuthenticated = await loginUser(credentials.email, credentials.password);
			if (isAuthenticated) {
				dispatch(navigate(Screens.DASHBOARD));
			} else {
				alert('Usuario o contraseña incorrectos.');
			}
		} catch (error) {
			alert('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
			console.error('Error en login:', error);
		}
		alert('Bienvenidx')
	}

	async render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
			    <link rel="stylesheet" href="./login.css">
				<section>
					<div class="imgLogin"><img src="../src/assets/Group 354.png" alt="" class="img-mobile"></div>
        			<img src="../src/assets/ImageBackgroundLoginandRegister.png" alt="">
					<div class="information">
						<div class="logo">
							<svg id="logo" width="139" height="77" viewBox="0 0 139 77" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#clip0_36_61)">
								<path d="M67.7073 24.6344C71.3053 27.1602 74.7596 30.9368 78.0703 35.9641C79.4736 38.0568 81.1597 39.9448 83.0803 41.5741C84.6968 42.7729 86.6716 43.3866 88.6818 43.3148C91.9321 43.3811 95.0787 42.1678 97.4455 39.9357C98.6096 38.905 99.5383 37.6352 100.168 36.2128C100.799 34.7903 101.115 33.2486 101.097 31.6926C101.097 28.5084 100.024 25.0805 97.8764 21.4088C95.4339 17.4024 92.2719 13.8835 88.5503 11.0299C84.0726 7.56171 79.0434 4.87391 73.6739 3.07935C67.4617 0.970744 60.938 -0.0703836 54.3791 5.30265e-05C43.0739 5.30265e-05 33.3534 2.33574 25.2178 7.00709C17.151 11.5882 10.645 18.4915 6.54375 26.8213C3.1196 33.784 1.04537 41.3341 0.431053 49.0712C0.160838 52.0773 -0.357707 55.493 0.314178 58.4699C1.41695 63.3924 5.89374 67.108 10.7138 68.1539C17.3888 69.6168 25.2543 65.7256 26.9924 58.8576C27.6789 56.1586 27.2845 53.4012 27.5036 50.6656C28.1901 42.2762 30.5418 35.4521 34.6096 30.2517C39.4784 23.9907 45.927 20.8602 53.9555 20.8602C59.5156 20.8602 64.0995 22.1183 67.7073 24.6344Z" fill="white"/>
								<path d="M135.728 34.6986C134.727 33.4909 133.467 32.524 132.043 31.8695C130.618 31.2149 129.065 30.8895 127.498 30.9172C124.905 30.8482 122.383 31.7745 120.45 33.5064C118.273 35.5692 116.463 37.9882 115.097 40.6597C112.117 45.8235 108.695 49.6635 104.829 52.1796C100.963 54.6957 96.3182 55.9537 90.8944 55.9537C87.066 55.9988 83.2742 55.2023 79.7864 53.6205C76.2608 51.9474 73.197 49.4364 70.862 46.3063C69.6766 44.7365 68.6445 43.0563 67.7801 41.2887C66.9183 39.526 66.3779 37.9973 64.7128 36.8124C62.6292 35.445 60.2066 34.6852 57.7164 34.6182C55.012 34.4872 52.3263 35.1294 49.9728 36.4699C47.6192 37.8103 45.695 39.7937 44.4248 42.1884C42.8692 45.1653 41.9637 49.0345 43.731 52.0699C45.6798 55.4718 48.026 58.6294 50.72 61.476L51.1217 61.8709C60.4843 71.3745 73.4108 76.1263 89.9012 76.1263C97.1035 76.228 104.274 75.1533 111.131 72.9447C116.817 71.1516 122.115 68.3059 126.753 64.5552C130.504 61.5271 133.636 57.8017 135.976 53.5839C137.992 49.7464 139 46.1381 139 42.7589C138.945 39.7589 137.779 36.8864 135.728 34.6986Z" fill="white"/>
								</g>
								<defs>
								<clipPath id="clip0_36_61">
								<rect width="139" height="76.119" fill="white"/>
								</clipPath>
								</defs>
							</svg>
						</div>
						<div class="userIn">
							<h3>Login</h3>
							<p id="redirectRegister">Not registered yet?<b id="sign-color"> Sign up</b></p>
							<div class="inputsValues">
								<input id="email" type="email" placeholder="Email">
								<input id="password" type="password" placeholder="Password">
							</div>
							<div class="btn">
								<button id="save">Start</button>
							</div>
						</div>
					</div>
    			</section>
			`;
			

			const cssLogin = this.ownerDocument.createElement("style");
			cssLogin.innerHTML = styles;
			this.shadowRoot?.appendChild(cssLogin);
			
			const pEmail = this.shadowRoot?.querySelector('#email') as HTMLInputElement;
			pEmail?.addEventListener('change', this.changeEmail);

			const pPaswword = this.shadowRoot?.querySelector('#password') as HTMLInputElement;
			pPaswword?.addEventListener('change', this.changePassword);

			const save = this.shadowRoot?.querySelector('#save');
			save?.addEventListener('click', () => {
				const emailValue = pEmail.value.trim();
				const paswdlValue = pPaswword.value.trim();
			
				if (!emailValue) {
					alert('Por favor, rellene todos los campos.');
					return; 
				}
			
				if (!paswdlValue) {
					alert('Por favor, rellene todos los campos.');
					return; 
				}
				this.submitForm();
			});

			const redirectToRegister = this.shadowRoot?.querySelector('#redirectRegister');
            redirectToRegister?.addEventListener('click',() =>  {
                dispatch(navigate(Screens.REGISTER))
            });

			const logoRedirectToDashboard = this.shadowRoot.querySelector('.logo')
            logoRedirectToDashboard?.addEventListener('click', () => {
                dispatch(navigate(Screens.DASHBOARD));
            });

		
		}
	}
}

customElements.define('app-login', Login);
export default Login;