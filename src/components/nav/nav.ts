import { dispatch } from '../../store/store';
import { navigate, loadPost, navigateUser} from '../../store/actions';
import { registerUser } from '../../utils/firebase';
import  {Screens} from '../../types/store'
import { appState } from '../../store/store';
import { getUserData,getUserIdByUsername } from '../../utils/firebase';

interface UserData {
    name: string;
    imgUser:string;
}
export enum AttributeNav { 
    'imguser' = 'imguser',
    'name' = 'name'
}
class Nav extends HTMLElement  {
    imguser?: string;
    name?: string;
    searchuser?:string
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return ['imguser', 'name'];
    }

    attributeChangedCallback(propName : AttributeNav, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            default:
                this[propName] = newValue;
                break;
        }
        this.render();
    }
    async connectedCallback() { 
        this.render();
        const bars = this.shadowRoot?.querySelector('.bars') as HTMLElement;
        bars.addEventListener('click', () => {
            const iconsResponsive = this.shadowRoot?.querySelector('.icons-responsive') as HTMLElement;
           
            if (iconsResponsive?.classList.contains('active')) {
                iconsResponsive?.classList.replace('active', 'inactive');   
            }else {
                iconsResponsive?.classList.replace('inactive', 'active'); 
            }
        });

        const searchInput = this.shadowRoot?.querySelector('#searchUser') as HTMLInputElement;
        const containerUserInformation = this.shadowRoot?.querySelector('.circle');

        searchInput?.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                const searchTerm = searchInput.value.trim(); // Obtener el valor del input
        
                if (searchTerm) {
                    // Llamar a getUserIdByUsername para obtener el userId a partir del username
                    getUserIdByUsername(searchTerm, (userId) => {
                        if (userId) {
                            getUserData(userId, (userInfo) => {
                                if (userInfo) {
                                    dispatch(navigateUser(Screens.ACCOUNTUSER, userInfo.id));
                                } else {
                                    alert('Usuario no encontrado');
                                }
                            });
                        } else {
                            alert('Usuario no encontrado');
                        }
                    });
                } else {
                    // Si el término de búsqueda está vacío, mostrar mensaje
                    alert('Por favor ingresa un nombre de usuario');
                }
            }
        });
        const userId = appState.user;

        if (!userId) {
            // Usuario no logueado, muestra imagen predeterminada
            const defaultImage = document.createElement('img');
            defaultImage.src = '../src/assets/ImgUserIcon.svg';
            defaultImage.alt = 'Default User Icon';
            defaultImage.id = 'img-usernav';
            containerUserInformation?.appendChild(defaultImage);
        } else {
            // Obtener información del usuario logueado
            getUserData(userId, (userInfo: UserData | null) => {
                if (!userInfo) {
                    console.warn('No se recibió información de usuario.');

                    // Usuario logueado pero no se recuperó información, muestra imagen predeterminada
                    const defaultImage = document.createElement('img');
                    defaultImage.src = '../src/assets/ImgUserIcon.svg';
                    defaultImage.alt = 'Default User Icon';
                    defaultImage.id = 'img-usernav';
                    containerUserInformation?.appendChild(defaultImage);
                    return;
                }

                // Limpiar contenido previo
                while (containerUserInformation?.firstChild) {
                    containerUserInformation.removeChild(containerUserInformation.firstChild);
                }

                this.name = userInfo.name || ''; 
                this.imguser = userInfo.imgUser || '';

                const userImage = document.createElement('img');
                userImage.src = this.imguser || '../src/assets/ImgUserIcon.svg'; // Si no hay imgUser, usa predeterminada
                userImage.alt = 'User Image';
                userImage.id = 'img-usernav';

                containerUserInformation?.appendChild(userImage);
            });
}

    }
   

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
           <link rel="stylesheet" href=../components/nav/nav.css">
           <link rel="stylesheet" href="../screens/account.css">
    <nav class="navegation">
        
            <div class="logo">
                <svg id="logo" width="62" height="50" viewBox="0 0 62 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_126_877)">
                    <path d="M19.658 45.7512L21.5993 46.4805C21.1795 47.4312 20.4928 48.2401 19.6222 48.8093C18.7441 49.399 17.7076 49.7089 16.6493 49.6983H16.2386C14.803 49.6983 13.4261 49.1291 12.411 48.1157C11.3958 47.1023 10.8255 45.7279 10.8255 44.2948V42.8265C10.823 42.1153 10.9611 41.4106 11.232 40.7528C11.5029 40.095 11.9013 39.4971 12.4042 38.9933C12.9071 38.4895 13.5047 38.0898 14.1627 37.817C14.8207 37.5443 15.5262 37.4039 16.2386 37.4039H16.6565C17.601 37.3952 18.5302 37.6423 19.3452 38.119C20.1511 38.5867 20.8248 39.251 21.3032 40.0497L19.4168 40.9197C19.0988 40.472 18.6812 40.104 18.1966 39.8447C17.7083 39.5788 17.1603 39.441 16.604 39.4442H16.3007C15.8513 39.4427 15.4059 39.5299 14.9904 39.7009C14.5748 39.8718 14.1972 40.1232 13.8794 40.4405C13.5615 40.7577 13.3097 41.1346 13.1385 41.5494C12.9672 41.9643 12.8798 42.4088 12.8814 42.8575V44.2424C12.8792 44.6912 12.9661 45.1361 13.1371 45.5512C13.3082 45.9663 13.56 46.3434 13.8779 46.6608C14.1959 46.9782 14.5737 47.2296 14.9896 47.4003C15.4054 47.5711 15.8511 47.6578 16.3007 47.6556H16.604C17.2451 47.6625 17.874 47.4801 18.4115 47.1312C18.9416 46.7889 19.3716 46.3128 19.658 45.7512Z" fill="white"/>
                    <path d="M24.6271 49.3958H22.5784V37.5399H24.6271V49.3958Z" fill="white"/>
                    <path d="M32.3899 40.7934H34.4386V49.3957H32.4161V49.1121C33.0322 48.5901 33.3426 48.1229 33.3426 47.7082V47.3554C33.3057 47.4375 33.2634 47.5171 33.216 47.5937C33.0954 47.7818 32.9647 47.9632 32.8244 48.1372C32.6316 48.3887 32.414 48.6203 32.1749 48.8284C31.8957 49.0595 31.5803 49.2431 31.2413 49.3719C30.8509 49.5308 30.4332 49.6118 30.0116 49.6102C28.9259 49.6077 27.8854 49.1759 27.1179 48.4093C26.3504 47.6427 25.9184 46.6038 25.9165 45.52V44.7025C25.919 43.6191 26.3513 42.5808 27.1187 41.8147C27.8861 41.0487 28.9263 40.6172 30.0116 40.6147C30.4477 40.5947 30.8834 40.6615 31.2933 40.8113C31.7033 40.9611 32.0793 41.1908 32.3994 41.487L32.3899 40.7934ZM32.3899 45.4676V44.7525C32.3949 44.4771 32.344 44.2035 32.2402 43.9483C32.1363 43.693 31.9817 43.4615 31.7857 43.2676C31.5948 43.0695 31.3649 42.9129 31.1106 42.8075C30.8563 42.7022 30.583 42.6502 30.3077 42.655H30.057C29.7809 42.6547 29.5076 42.7087 29.2525 42.814C28.9974 42.9193 28.7656 43.0738 28.5704 43.2686C28.3753 43.4635 28.2205 43.6948 28.115 43.9495C28.0095 44.2041 27.9554 44.477 27.9557 44.7525V45.4676C27.9554 45.7431 28.0095 46.016 28.115 46.2707C28.2205 46.5253 28.3753 46.7566 28.5704 46.9515C28.7656 47.1463 28.9974 47.3008 29.2525 47.4061C29.5076 47.5114 29.7809 47.5655 30.057 47.5651H30.3077C30.583 47.5699 30.8563 47.518 31.1106 47.4126C31.3649 47.3072 31.5948 47.1506 31.7857 46.9526C31.9817 46.7586 32.1363 46.5271 32.2402 46.2719C32.344 46.0166 32.3949 45.743 32.3899 45.4676Z" fill="white"/>
                    <path d="M39.2452 44.3306C40.3994 44.6866 41.1833 45.0004 41.5972 45.2721C42.3327 45.7584 42.7004 46.394 42.7004 47.179C42.7004 47.8535 42.3566 48.4208 41.6689 48.8761C40.9364 49.3452 40.0794 49.5835 39.2094 49.5602C37.96 49.5926 36.7427 49.1621 35.7925 48.3517L36.5399 46.4448C36.9773 46.8473 37.4924 47.1563 38.0537 47.353C38.6095 47.5749 39.2008 47.6952 39.7992 47.7081C40.4034 47.7081 40.8021 47.5484 40.9931 47.2314C41.0453 47.1502 41.076 47.057 41.0823 46.9607C41.0885 46.8644 41.0702 46.7681 41.0289 46.6808C40.8581 46.4277 40.6165 46.2304 40.3341 46.1135C39.8268 45.8621 39.2967 45.6593 38.751 45.5081C36.5064 44.8455 35.5266 43.8261 35.8116 42.45C35.8733 42.1722 35.9933 41.9107 36.1637 41.6827C36.3341 41.4546 36.551 41.2653 36.8001 41.1271C37.406 40.7531 38.1082 40.5642 38.8202 40.5836C39.4356 40.5804 40.0491 40.6525 40.6469 40.7982C41.0805 40.8894 41.5014 41.0326 41.9005 41.2248L42.2754 41.437L41.559 43.3438L41.3632 43.2556C41.22 43.1841 41.0504 43.1078 40.8546 43.0173C40.6588 42.9267 40.4463 42.8504 40.2147 42.7789C39.9726 42.6923 39.7254 42.6207 39.4745 42.5644C39.2477 42.5094 39.0154 42.4798 38.782 42.4762C38.3642 42.4762 38.08 42.6001 37.9248 42.848C37.8318 42.9754 37.7921 43.1339 37.8139 43.2899C37.8357 43.446 37.9175 43.5876 38.0418 43.6847C38.3908 43.9852 38.8016 44.2057 39.2452 44.3306Z" fill="white"/>
                    <path d="M48.2377 40.579C49.2708 40.579 50.019 40.8698 50.4822 41.4514C50.9513 42.0485 51.197 42.7903 51.1771 43.5489V49.3958H49.1307V44.3307C49.1426 44.1298 49.1078 43.929 49.0291 43.7438C48.9505 43.5585 48.8299 43.3939 48.677 43.2629C48.3739 43.0148 47.992 42.883 47.6001 42.891C47.1847 42.8824 46.7791 43.0171 46.4516 43.2724C46.2934 43.3981 46.1675 43.5597 46.0844 43.7438C46.0013 43.9279 45.9635 44.1291 45.9741 44.3307V49.3958H43.9253V37.5399H45.9741V41.0604L45.4559 41.7183C45.2644 41.9748 45.1591 42.2852 45.155 42.605V42.9077L45.2529 42.6693C45.4801 42.197 45.787 41.7672 46.1603 41.3989C46.4231 41.1629 46.7243 40.9735 47.051 40.8388C47.4238 40.6696 47.8282 40.5811 48.2377 40.579Z" fill="white"/>
                    </g>
                    <g clip-path="url(#clip1_126_877)">
                    <path d="M30.2003 10.988C31.8052 12.1146 33.3459 13.7991 34.8227 16.0415C35.4486 16.975 36.2006 17.8171 37.0574 18.5438C37.7784 19.0786 38.6592 19.3523 39.5558 19.3203C41.0056 19.3498 42.4091 18.8087 43.4648 17.813C43.9841 17.3533 44.3983 16.7869 44.6794 16.1525C44.9605 15.518 45.1017 14.8303 45.0936 14.1363C45.0936 12.716 44.6148 11.187 43.6571 9.54924C42.5676 7.76223 41.1572 6.19264 39.4972 4.91982C37.5 3.37285 35.2567 2.17398 32.8617 1.37353C30.0908 0.432999 27.1809 -0.0313888 24.2554 2.89213e-05C19.2128 2.89213e-05 14.877 1.04185 11.2481 3.12547C7.65002 5.16884 4.74807 8.24799 2.91874 11.9635C1.39142 15.0691 0.466224 18.4368 0.192212 21.8879C0.0716846 23.2287 -0.159609 24.7523 0.140081 26.0801C0.631963 28.2757 2.62881 29.9331 4.77876 30.3996C7.75611 31.0521 11.2645 29.3165 12.0397 26.253C12.3459 25.0492 12.17 23.8192 12.2677 22.5991C12.574 18.857 13.6229 15.8132 15.4373 13.4936C17.609 10.7009 20.4854 9.30456 24.0664 9.30456C26.5465 9.30456 28.5911 9.8657 30.2003 10.988Z" fill="white"/>
                    <path d="M60.5405 15.4771C60.0939 14.9384 59.5321 14.5071 58.8967 14.2152C58.2612 13.9232 57.5684 13.7781 56.8693 13.7904C55.7128 13.7596 54.5882 14.1728 53.7258 14.9453C52.7548 15.8654 51.9474 16.9444 51.3381 18.136C50.009 20.4393 48.4823 22.1521 46.758 23.2744C45.0337 24.3967 42.962 24.9578 40.5427 24.9578C38.8351 24.9779 37.1438 24.6227 35.5881 23.9171C34.0155 23.1708 32.649 22.0508 31.6074 20.6546C31.0787 19.9544 30.6183 19.205 30.2328 18.4166C29.8484 17.6303 29.6073 16.9485 28.8646 16.42C27.9352 15.81 26.8547 15.4711 25.7439 15.4412C24.5377 15.3828 23.3397 15.6693 22.2899 16.2672C21.2401 16.8651 20.3819 17.7497 19.8153 18.8179C19.1214 20.1457 18.7175 21.8715 19.5058 23.2254C20.3751 24.7429 21.4216 26.1513 22.6232 27.421L22.8024 27.5971C26.9785 31.8362 32.7443 33.9557 40.0997 33.9557C43.3123 34.001 46.5107 33.5217 49.5693 32.5365C52.1052 31.7367 54.4687 30.4674 56.5371 28.7945C58.2103 27.4438 59.6073 25.7821 60.6513 23.9008C61.5504 22.1891 61.9999 20.5796 61.9999 19.0723C61.9752 17.7342 61.4551 16.453 60.5405 15.4771Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_126_877">
                    <rect width="40.3492" height="12.3016" fill="white" transform="translate(10.8254 37.3969)"/>
                    </clipPath>
                    <clipPath id="clip1_126_877">
                    <rect width="62" height="33.9524" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="first-icons">
                <ul>
                    <li id="dash">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-grid-1x2-fill" viewBox="0 0 16 16">
                            <path d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1zm0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z"/>
                        </svg>
                        <a href="#">Dashboard</a>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-bag-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z"/>
                        </svg>
                        <a href="#">Jobs</a>
                    </li>
                </ul>
            </div>
            
            <div class="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <input id="searchUser" type="text" placeholder="Search User: @user">
                
            </div>
            <div class="third-icons">
                <ul>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                            <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <a href="#">Messages</a>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                        </svg>
                        <a href="#">Notifications</a>
                    </li>
                </ul>
            </div>
            <div class="user-icon">
               <div class="circle">
                    
                </div>
            </div>
            <div class="bars">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
           
            
    </nav>
    <div class="icons-responsive inactive" >
        <div class="active-icons">
                    <ul>
                    
                        <li id="dashtwo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-grid-1x2-fill" viewBox="0 0 16 16">
                                <path d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1zm0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z"/>
                            </svg>
                            <a href="#" class="active">Dashboard</a>
                        </li>
                        <li id="jobs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-bag-fill" viewBox="0 0 16 16">
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z"/>
                            </svg>
                            <a href="#">Jobs</a>
                        </li>
                    
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                                <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                            </svg>
                            <a href="#">Messages</a>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                            </svg>
                            <a href="#">Notifications</a>
                        </li>
                    </ul>
                </div>
            </div>
           
             
          
            `;
            const userId = appState.user; 
            const navNew = this.shadowRoot.querySelector('#nav-new');
            const navAll = this.shadowRoot.querySelector('#nav-all');
            const redirectToLoginUsers = this.shadowRoot?.querySelector('.user-icon');
            navNew?.addEventListener('click', ()=>{
                dispatch(loadPost(true))
            })
            navAll?.addEventListener('click', ()=>{
                dispatch(loadPost(false))
            })

            redirectToLoginUsers?.addEventListener('click',() =>  {
                if (userId) {
                    dispatch(navigate(Screens.ACCOUNT))
                }else{
                    dispatch(navigate(Screens.LOGIN))
                }
            });

            const logoRedirectToDashboard = this.shadowRoot.querySelector('.logo')
            logoRedirectToDashboard?.addEventListener('click', () => {
                dispatch(navigate(Screens.DASHBOARD));
            });

            const dashRedirectToDashboard = this.shadowRoot.querySelector('#dash')
            dashRedirectToDashboard?.addEventListener('click', () => {
                dispatch(navigate(Screens.DASHBOARD));
            });

            const dashtwoRedirectToDashboard = this.shadowRoot.querySelector('#dashtwo')
            dashtwoRedirectToDashboard?.addEventListener('click', () => {
                dispatch(navigate(Screens.DASHBOARD));
            });
        }
    }
};

customElements.define('nav-component',Nav);
export default Nav;