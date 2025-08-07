  // Import the functions you need from the SDKs you need
  import { 
    initializeApp 
  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  
  import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
  
  import { 
    getFirestore, 
    getDoc, 
    doc, 
    setDoc 
  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: " ", -//API Key'inizi buraya yazın.
    authDomain: "loginpage-6621d.firebaseapp.com",
    projectId: "loginpage-6621d",
    storageBucket: "loginpage-6621d.firebasestorage.app",
    messagingSenderId: "740215161929",
    appId: "1:740215161929:web:e4bf9cdf880b0afcbc6b98"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Hesabınız Oluşturuldu', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='admin-login-screen.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Bu mail hesabı zaten kullanılıyor!', 'signUpMessage');
        }
        else{
            showMessage('Hesap oluşturulamadı.', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('Giriş Başarılı', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='admin.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Hatalı E-mail veya Şifre', 'signInMessage');
        }
        else{
            showMessage('Geçersiz hesap', 'signInMessage');
        }
    })
 })

 // firebaseauth.js dosyasına eklenecek
const auth = getAuth();

// Oturum durumunu kontrol et
onAuthStateChanged(auth, (user) => {
  // Eğer admin.html sayfasındaysak ve kullanıcı giriş yapmamışsa
  if (window.location.pathname.includes('admin.html') && !user) {
    window.location.href = 'admin-login-screen.html';
    return;
  }
  
  // Eğer login sayfasındaysak ve kullanıcı zaten giriş yapmışsa
  if (window.location.pathname.includes('admin-login-screen.html') && user) {
    window.location.href = 'admin.html';
    return;
  }
});

// Giriş işlemini güncelle
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    // persistence özelliğini LOCAL olarak ayarla
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Giriş Başarılı', 'signInMessage');
            const user = userCredential.user;
            window.location.href = 'admin.html';
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-credential') {
            showMessage('Hatalı E-mail veya Şifre', 'signInMessage');
        } else {
            showMessage('Geçersiz hesap', 'signInMessage');
        }
    });

});
