import { Q as i } from "./QBtn.34d95a7b.js";
import { Q as c } from "./QPage.a48a9159.js";
import { A as a, u as l } from "./api.85bc65bb.js";
import { _ as d, s as u, t as p, u as h, v as m, E as s, x as f, Q as o } from "./index.60cc3aef.js";

const n = t => new Promise(e => setTimeout(e, t));

const g = u({
    name: "AuthPage",
    data() {
        return { loading: false }
    },
    methods: {
        dec2hex(t) {
            return t.toString(16).padStart(2, "0")
        },
        generateId(t) {
            const e = new Uint8Array((t || 40) / 2);
            crypto.getRandomValues(e);
            return Array.from(e, this.dec2hex).join("");
        },
        authNew() {
            console.log("authNew called – opening login window");
            chrome.windows.create({
                url: "http://localhost:9000/login",
                type: "popup"
            });
        },
        async startAuth() {
            const t = this.generateId(128);
            console.log("startAuth called – generated ID:", t);
            chrome.windows.create({
                url: "http://localhost:9000/app/" + t,
                type: "popup"
            });
            await n(2000);
            for (let e = 0; e < 10; e++) {
                try {
                    const res = await a.init().authByCode(t);
                    console.log("Attempt", e, "authByCode response:", res);
                    if (!(res.response.user))
                        continue;
                    console.log("User authenticated – redirecting to '/'");
                    return this.$router.push("/");
                } catch (err) {
                    console.error("Error in authByCode attempt", e, ":", err);
                }
                await n(1000);
            }
            console.log("startAuth: no authentication succeeded after 10 attempts.");
        },
        async login() {
            try {
                const t = await a.init().getUser();
                console.log("getUser response:", t);
                if (t.success) {
                    this.store.setUser(t.response.user);
                    this.store.setLoggedIn(true);
                    this.$router.push("/");
                } else {
                    await this.startAuth();
                }
            } catch (err) {
                console.error("Error in login:", err);
                this.store.setLoggedIn(false);
                await this.startAuth();
            } finally {
                this.loading = false;
            }
        }
    },
    setup() {
        return { store: l() }
    }
});

const w = { class: "col items-center justify-center content-center" };

const _ = s("div", { class: "text-center q-mb-md" }, [
    o(" Authorize on "),
    s("a", { href: "http://localhost:9000/app", target: "_blank" }, "http://localhost:9000/app"),
    o(" first to get access ")
], -1);

function y(t, e, r, x, A, I) {
    return p(),
        h(c, { class: "flex flex-center" }, {
            default: m(() => [
                s("div", w, [
                    _,
                    f(i, {
                        color: "white",
                        class: "full-width",
                        "text-color": "black",
                        label: "S'IDENTIFIER",
                        onClick: t.authNew,
                        loading: t.loading
                    }, null, 8, ["onClick", "loading"])
                ])
            ]),
            _: 1
        });
}

var C = d(g, [["render", y]]);
export { C as default };
