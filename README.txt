v0.1

-. slidechange event --> recontribute
2. add zoom button (fade in/out on mouse movement)
    * fix height, fix width -- zoom in more?
3. remove bootstrap dependency (probably saves a substantial amount of css) or customize bootstrap and vendor it
4. publish to github.io

future
- svg, .json, and Gruntfile.js changes should kick off rebuild
- use cookies to store preview size
- resize when clicking on edge and holding
- set up deployment to dzaman.org 
    * heroku, ec2?
    * cloudflare?
    * jndex.dzaman.org?

questions
    - can icons be furhter optimized?
        - only load each icon once and just append it to the dom multiple times?
        - use background images defined once in css?
    - do I need to include the doctype?
        - <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> 
    - what is a good place to write rendering logic? not sure how much belongs in the template and how much belongs in the view
    - does navigation make sense? look into error case

