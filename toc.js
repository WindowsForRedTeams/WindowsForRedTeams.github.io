// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="License.html"><strong aria-hidden="true">1.</strong> License</a></li><li class="chapter-item expanded "><a href="Foreword.html"><strong aria-hidden="true">2.</strong> Foreword</a></li><li class="chapter-item expanded "><a href="Introduction.html"><strong aria-hidden="true">3.</strong> Introduction to Red Teaming</a></li><li class="chapter-item expanded "><a href="Laws.html"><strong aria-hidden="true">4.</strong> Laws and Compliance</a></li><li class="chapter-item expanded "><a href="Windows.html"><strong aria-hidden="true">5.</strong> Windows Fundamentals</a></li><li class="chapter-item expanded "><a href="Essentials.html"><strong aria-hidden="true">6.</strong> Malware Essentials</a></li><li class="chapter-item expanded "><a href="Persistence.html"><strong aria-hidden="true">7.</strong> Malware Persistence</a></li><li class="chapter-item expanded "><a href="Escalation.html"><strong aria-hidden="true">8.</strong> Privilege Esaclation Techniques with Malware</a></li><li class="chapter-item expanded "><a href="Evasion.html"><strong aria-hidden="true">9.</strong> Malware Detection Evasion Techniques</a></li><li class="chapter-item expanded "><a href="Command.html"><strong aria-hidden="true">10.</strong> Introduction to C2 Frameworks and Operations Security</a></li><li class="chapter-item expanded "><a href="Active.html"><strong aria-hidden="true">11.</strong> Understanding Active Directory</a></li><li class="chapter-item expanded "><a href="Metasploit.html"><strong aria-hidden="true">12.</strong> Metasploit Framework</a></li><li class="chapter-item expanded "><a href="Havoc.html"><strong aria-hidden="true">13.</strong> Havoc Framework</a></li><li class="chapter-item expanded "><a href="Sliver.html"><strong aria-hidden="true">14.</strong> Sliver Framework</a></li><li class="chapter-item expanded "><a href="Empire.html"><strong aria-hidden="true">15.</strong> Empire Framework</a></li><li class="chapter-item expanded "><a href="Cobalt.html"><strong aria-hidden="true">16.</strong> Cobalt Strike Framework</a></li><li class="chapter-item expanded "><a href="Writing.html"><strong aria-hidden="true">17.</strong> Writing Your Own C2 Framework</a></li><li class="chapter-item expanded "><a href="Cases.html"><strong aria-hidden="true">18.</strong> Malware Case Studies</a></li><li class="chapter-item expanded "><a href="Virtual.html"><strong aria-hidden="true">19.</strong> Appendix A: Virtual Addresses, Page Tables, and Page Table Entries</a></li><li class="chapter-item expanded "><a href="Shellcode.html"><strong aria-hidden="true">20.</strong> Appendix B: Manually Writing Shellcode for Windows</a></li><li class="chapter-item expanded "><a href="Kerberos.html"><strong aria-hidden="true">21.</strong> Appendix C: A Primer on Kerberos</a></li><li class="chapter-item expanded "><a href="Reversing.html"><strong aria-hidden="true">22.</strong> Appendix X: Reversing the _DEBUG_OBJECT with WinDBG</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
