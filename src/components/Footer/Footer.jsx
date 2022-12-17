import React from "react";
import './Footer.css'

export default function Footer(props) {
    return (
        <div id="footerBody" className="flexCenter">
            <h1 id="copyright">© Victor Martini Domingues</h1>

            <div className="infos">
                <h1>
                    Meus contatos:
                </h1>
                <ul>
                    <li>
                        <a href="https://www.linkedin.com/in/victor-martini-domingues-5b6986161/" target="_blank">
                            <img className="images" src="https://t.ctcdn.com.br/09Y6BbLFxNn7XGCYRGzEI0p0oy8=/400x400/smart/filters:format(webp)/i490027.jpeg" alt="" />
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/victormdsp" target="_blank">
                            <img className="images colorAdjust" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" />
                        </a>
                    </li>
                    <li>Tel: 11986200468</li>
                </ul>
            </div >
        </div >
    )

}