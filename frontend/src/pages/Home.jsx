import banner from '../assets/deepaldesktopbanner-06122024114257.jpg'
import '../styles/Home.css'
import secondBanner from '../pages/Pics/npl-quiz-mobile.jpg';
import thirdBanner from '../assets/npl-banner.jpg';


export default function Home (){
    return(
        <div className='Home'>
        <div className='banner'>
        <img src={banner} /> <br/><br/>
           <img src={thirdBanner}/>
              </div>

              <div className="second-banner">
                <img src={secondBanner}/>
        
              </div><br/>
              <div className="tird-banner">
             

              </div>

              
              
</div>
    
    
    )
}