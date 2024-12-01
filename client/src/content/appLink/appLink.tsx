import React from 'react'
import './appLink.css'

const appLink = () => {
    return (
        <div className="body-div">
            <div id="header">
                <img alt="Matrimony" height="100" src="/Image20221010173301.png" />
                <br />
                <span>
                    Welcome to Matrimony.</span>
            </div>
            <div id="getstarted">
                This link was intended for Matrimony Mobile Apps. <br /><br />
                Please click this link from your mobile phone, if you have already installed the app. <br /><br />
                If not, please install the app first using the link below. You can also visit Google Play Store or Apple App Store and search <strong>Matrimony</strong> to install the app.<br />
                <span style={{ display: "block", margin: "15px auto", maxWidth: "400px" }}>
                    <a href="https://play.google.com/store/apps/details?id=com.demo.matrimonyapp">
                        <img width="200px" alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" />
                    </a>
                </span>
                <span style={{ display: "block", margin: "15px auto", maxWidth: "400px" }}>
                    <a href="https://apps.apple.com/in/app/matrimony/id123456789">
                        <img width="200px" alt="Get it on App Store" src="https://www.visualphysics.in/assets/img/app-store.png" /></a></span>
            </div>
        </div>
    )
}

export default appLink