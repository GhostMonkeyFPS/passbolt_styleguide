<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <title>Passbot | The open source password manager for teams</title>
    <?php include('includes/AA_meta.php'); ?>
    <link rel="stylesheet" type="text/css" href="css/public.css" />
    <style>
    </style>
</head>
<body>
<div id="container" class="page home">
<?php include('includes/AA_header_prelaunch.php'); ?>
    <div class="page-row three-little-birds">
        <div class="grid grid-responsive-12">
            <div class="row ">
                <div class="col12">
                    <div class="logo bigger no-img">
                        <h1><span>Passbolt</span></h1>
                    </div>
                    <div class="teaser-text">
                        <p>
                            The password manager your team was waiting for.
                            Free, open source, extensible, GPG based.
                        </p>
                    </div>
                    <div class="call-to-action">
                        <a href="AN_login.php" class="button primary">
                            Try out the demo!
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="page-row features">
        <h2>Available now on firefox!</h2>
        <h2>Support for chrome is on the roadmap of course.</h2>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="../src/img/screenshots/teaser-screenshot-login.png" />
                    <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                    <h3>Authenticate using your gpg key</h3>
                </div>
                <div class="swiper-slide">
                    <img src="../src/img/screenshots/teaser-screenshot-share.png" />
                    <h3>Share passwords with your team</h3>
                </div>
                <div class="swiper-slide">
                    <img src="../src/img/screenshots/teaser-screenshot4.png" />
                    <h3>Search and filter on passwords</h3>
                </div>
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>
        </div>
    </div>

    <div class="page-row cli">
        <div class="grid grid-responsive-12">
            <div class="row">
                <div class="col5">
                    <h2>Coming soon to a terminal near you!</h2>
                    <p>
                        Because system administrator appreciation day should be everyday we started building
                        a client base on nodejs. Come join us!
                    </p>
                    <a href="#" class="button cancel big">
                        <i class="fa fa-fw fa-github"></i>
                        Show me the code!
                    </a>
                </div>
                <div class="col7 last">
                    <div class="cli-window">
                        <div class="cli-header"><span class="visuallyhidden">Command line example</span></div>
                        <div class="cli-code">
<pre>
$ passbolt find --name=root@192.168.0.1
d1acbfc1-78d8-3e25-ad8b-7ab1eb0332dc

$ passbolt get d1acbfc1-78d8-3e25-ad8b-7ab1eb0332dc
-----BEGIN PGP MESSAGE-----
Version: GnuPG v2

hQIMAw0P12ReHhxtAQ//cgr5H+SxUNoIoLsACRlyPDyXeZ6Liyksv
TB9RVSuuO225+HgQUwkRIUQ6ufyGi/VXlw2uwrDdixhWQ600UwSQN
k7pogSmKC4bCiEWy/NGlZz6hscz0hN89c+tx3wjFRsXnGsvKVnRCM
FN/pSWklYlym1Se+0banl3/EPve2
=Bhgw
-----END PGP MESSAGE-----

$ gpg --decrypt $(passbolt get last)
please enter passphrase: <span class="blink seriously">█</span>
</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="page-row usp">
        <h2>How is passbolt different from other password managers?</h2>
        <div class="grid grid-responsive-12">
            <div class="row">
                <div class="col6">
                    <div class="tile">
                        <div class="tile-teaser"><i class="slack"></i></div>
                        <div class="tile-title">Built for teams</div>
                        <div class="tile-description">
                            Works with tools your team already use such as your email client and chat.
                        </div>
                    </div>
                    <div class="tile">
                        <div class="tile-teaser"><i class="opensource"></i></div>
                        <div class="tile-title">Open source & free</div>
                        <div class="tile-description">
                            Run it on your own servers. Customize it and share back the changes.
                        </div>
                    </div>
                    <div class="tile">
                        <div class="tile-teaser"><i class="json"></i></div>
                        <div class="tile-title">API & extensible design</div>
                        <div class="tile-description">
                            Build on top of our API to get more of your password solution.
                        </div>
                    </div>
                </div>
                <div class="col6 last">
                    <div class="tile first">
                        <div class="tile-teaser"><i class="gnupg"></i></div>
                        <div class="tile-title">Built on security standards</div>
                        <div class="tile-description">
                            Secrets are encrypted in a browser extension using GPG and sent over SSL.
                        </div>
                    </div>
                    <div class="tile first">
                        <div class="tile-teaser"><i class="docker"></i></div>
                        <div class="tile-title">Top of the line tooling</div>
                        <div class="tile-description">
                            We ship with tools and code standards your admin team will like to work with.
                        </div>
                    </div>
                    <div class="tile first">
                        <div class="tile-teaser"><i class="jenkins"></i></div>
                        <div class="tile-title">Methodically tested</div>
                        <div class="tile-description">
                             Half of the code base is there to make sure the other half is behaving.
                        </div>
                    </div>
                </div>
            </div>
            <div class="row call-to-action">
                <div class="col12">
                    <a href="AN_login.php" class="button primary big">Try out the demo!</a>
                </div>
            </div>
        </div>
    </div>

    <div class="page-row api">
        <div class="api-wrapper">
        <div class="grid grid-responsive-12">
            <div class="row">
                <div class="col6 explain">
                    <h2>Discover passbolt API</h2>
                    <div class="teaser-text">
                        <p>
                            Our long term vision is to play nice with others. We aim to provide integration other
                            password managers, keyrings and user management services instead of trying to replace them.
                        </p>
                        <p>
                            Obviously there is still a long way to go, but for now you can already build custom
                            integrations by taking advantage of the JSON API.
                        </p>
                    </div>
                    <div class="call-to-action">
                        <a href="AN_login.php" class="button cancel big">
                            <i class="fa fa-fw fa-github-alt"></i>
                            Browse the code
                        </a>
                        <span class="button-spacer">or</span>
                        <a href="AN_login.php" class="button primary big">
                            Read the doc!
                        </a>
                    </div>
                </div>
                <div class="col5 push1 last show">
                </div>
            </div>
        </div>
        </div>
    </div>

    <div class="page-row signup">
        <div class="grid grid-responsive-12">
            <div class="row">
                <div class="col12 last">
                    <h2>Let's keep in touch!</h2>
                </div>
            </div>
            <div class="row">
                <div class="col8 newsletter">
                    <div class="registration form">
                        <form action="/" id="RegistrationsPrelaunchForm" method="post" accept-charset="utf-8"><div style="display:none;"><input type="hidden" name="_method" value="POST"/></div>
                            <div class="inline email input">
                            <label for="RegistrationEmail">Signup to the newsletter</label>
                            <input name="data[Registration][email]" class="required fluid" placeholder="Your email" type="email" id="RegistrationEmail" required="required"/></div>
                            <div class="submit"><input  class="button primary" type="submit" value="subscribe"/></div>
                            <div class="smallprint"><a href="#">We respect your privacy.</div>
                        </form>
                    </div>
                </div>
                <div class="col4 last social">
                    <a href="https://www.twitter.com/passbolt">
                        <i class="fa fa-fw fa-twitter-square"></i>
                    </a>
                    <a href="https://www.facebook.com/passbolt">
                        <i class="fa fa-facebook-square"></i>
                    </a>
                    <a href="https://www.github.com/passsbolt">
                        <i class="fa fa-fw fa-github-square"></i>
                    </a>

                </div>
            </div>
        </div>

    </div>
<?php include('includes/AN_footer.php'); ?>
</div>
<script src="js/jquery-2.1.3.min.js"></script>
<script src="js/swiper.jquery.min.js"></script>
<script>
    var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        pagination: '.swiper-pagination',
        loop: true,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        keyboardControl: true,
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : false
        },
        // Navigation arrows
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

    })
</script>
</body>
</body>
</html>