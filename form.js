// MIT license
// Ping tatadoan@outlook.com for Info | Bug | More Feature
// I'd be happy to have a response
const defaultDateFormat = "dmy"
const defaultDateFormatSep = "/"

isDateType = (v) => v != undefined && typeof v.getMonth == "function"
pad2 = (v) => String(v).padStart(2, '0')
isDatetime = (v) => v.getHours() + v.getMinutes() + v.getSeconds() != 0

function isDateString(str) {
    const _regExp = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
    return _regExp.test(str);
}
isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)
capitalizeFirstLetter = (str) => (str === undefined || str.length == 0) ? "" : str.charAt(0).toUpperCase() + str.slice(1)

if (window.JSON && !window.JSON.dateParser) {
    JSON.dateParser = function(k, v) {

        if (typeof v === 'string' && v.length == 24 && v.endsWith("Z") && v.charAt(4) == '-' && v.charAt(7) == '-') {
            let dt = new Date(v.replace("Z", ""))
            return dt;
        }
        return v;
    };
}






function ajax(url, success, fall) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.overrideMimeType("text/html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status == 200) {
            let data = parserData(xhr.responseText)
            if (success) success(data)
        } else {
            if (xhr.readyState > 3 && xhr.status >= 400) {
                let error = parserData(xhr.responseText)
                if (fall) fall(error)
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xhr.send();
    return xhr;
}

function ajax1(method, url, data, success, fall) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")

    xhr.open(method, url)
    xhr.overrideMimeType("text/html")
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && (xhr.status == 200 || xhr.status == 201)) {
            let item = parserData(xhr.responseText)
            if (success) success(item)
        } else {
            if (xhr.readyState > 3 && xhr.status >= 400) {
                let error = parserData(xhr.responseText)
                if (fall) fall(error)
            }
        }

    };
    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    if (data == undefined) {
        xhr.send();
    } else {

        xhr.send(JSON.stringify(dateNguZ(data)));
    }
    return xhr;
}

function dateNguZ(data) {
    let data1 = {}
    for (let k in data) {
        let v = data[k]
        if (v instanceof Date) {
            data1[k] = new Date(v.getTime() - v.getTimezoneOffset() * 60000);
        } else if (Array.isArray(v)) {
            let arr1 = v;
            let arr = []
            for (a in arr1) {
                let b = dateNguZ(arr1[a])
                arr.push(b)
            }
            data1[k] = arr

        } else {
            data1[k] = v
        }
    }
    return data1
}

function parserData(str) {
    if (str.length > 0) {
        if (str.charAt(0) == "{" || str.charAt(0) == "[") {
            return JSON.parse(str, JSON.dateParser);
        }
    }
    return str
}

function value2Text(value, format) {
    switch (format) {
        case "dmy":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return pad2(value.getDate()) + defaultDateFormatSep + pad2(value.getMonth() + 1) + defaultDateFormatSep + value.getFullYear()

            return ""
        case "mdy":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return pad2(value.getMonth() + 1) + defaultDateFormatSep + pad2(value.getDate()) + defaultDateFormatSep + value.getFullYear()
            return ""
        case "ymd":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return value.getFullYear() + defaultDateFormatSep + pad2(value.getMonth() + 1) + defaultDateFormatSep + pad2(value.getDate())
            return ""
        case "ymdhms":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return value.getFullYear() + defaultDateFormatSep + pad2(value.getMonth() + 1) + defaultDateFormatSep + pad2(value.getDate()) + " " + pad2(value.getHours()) + ":" + pad2(value.getMinutes()) + ":" + pad2(value.getSeconds())
            return ""
        case "date":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return "Date(" + value.getFullYear() + "," + (value.getMonth() + 1) + "," + value.getDate() + ")"
            return ""
        case "datetime":
            if (typeof value === "string") {
                value = parserDateString(value);
            }
            if (isDateType(value)) return "DateTime(" + value.getFullYear() + "," + (value.getMonth() + 1) + "," + value.getDate() + "," + value.getHours() + ",", value.getMinutes() + "," + value.getSeconds() + ")"
            return ""
        case "number":
            if (value != undefined)
                return Number(value).toLocaleString()
            else
                return ""
        case "number1":
            if (value != undefined)
                return Number(value).toLocaleString(undefined, { minimumFractionDigits: 1 })
            else
                return ""
        case "number2":
            if (value != undefined)
                return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })
            else
                return ""
        case "bool":
            return (value) ? "true" : "false"
        case "fromnow":
            if (value) {
                if (value.getDate) {
                    let ff = new Date()

                    let ts = new Date() - value;
                    if (ts < 60000) {
                        return Math.floor(ts / 1000) + " seconds";
                    }
                    if (ts < 3600000) {
                        return Math.floor(ts / 60000) + " minus";
                    }
                    if (ts < 86400000) {
                        return Math.floor(ts / 3600000) + " hours";
                    } else {
                        return Math.floor(ts / 86400000) + " days";
                    }
                }
            }
            return value;
        case "day":
            if (value) {
                if (value.getDate) {
                    return pad2(value.getDate());
                }
            }
            return value;
        case "month":
            if (value) {
                if (value.getDate) {
                    return pad2(value.getMonth() + 1);
                }
            }
            return value;
        case "year":
            if (value) {
                if (value.getDate) {
                    return value.getFullYear();
                }
            }
            return value;
        case "docso":
            if (value) {
                return doc1(value);
            }
            return value;
        case "Docso":
            if (value) {
                let vdoc = doc1(value);
                if (vdoc.length > 0) {
                    return capitalizeFirstLetter(vdoc);
                }
            }
            return value;
        case "id":
            return value
        case "calculate":
            return value
        default:
            if (value == null) return ""
            if (isDateType(value)) return value2Text(value, defaultDateFormat)
            return value
    }
}

function text2Value(text, format) {
    let p = null
    let y = 0,
        mo = 0,
        da = 0
    switch (format) {
        case "date":
            return text2Value(text, defaultDateFormat)
        case "dmy":
            if (!text || text.trim().length == 0) return null
            p = text.match(/[0-9]+/g)
            if (p.length == 3) {
                y = parseInt(p[2], 10)
                y = (y < 100) ? y + 2000 : y
                mo = parseInt(p[1], 10) - 1
                da = parseInt(p[0], 10)
                return new Date(y, mo, da, 0, 0, 0, 0)
            }
            if (p.length == 2) return new Date(new Date().getFullYear(), parseInt(p[1], 10) - 1, parseInt(p[0], 10), 0, 0, 0, 0)
            return null
        case "mdy":
            if (!text || text.trim().length == 0) return null
            p = text.match(/[0-9]+/g)
            if (p.length == 3) {
                y = parseInt(p[2], 10)
                y = (y < 100) ? y + 2000 : y
                return new Date(y, parseInt(p[0], 10) - 1, parseInt(p[1], 10), 0, 0, 0, 0)
            }
            if (p.length == 2) return new Date(new Date().getFullYear(), parseInt(p[0], 10) - 1, parseInt(p[1], 10), 0, 0, 0, 0)
            return null
        case "ymd":
            if (!text || text.trim().length == 0) return null
            p = text.match(/[0-9]+/g)
            if (p.length == 3) {
                y = parseInt(p[0], 10)
                y = (y < 100) ? y + 2000 : y
                return new Date(y, parseInt(p[1], 10) - 1, parseInt(p[2], 10), 0, 0, 0, 0)
            }
            return null
        case "ymdhms":
            if (!text || text.trim().length == 0) return null
            p = text.match(/[0-9]+/g)
            if (p.length == 6) return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10), parseInt(p[3], 10), parseInt(p[4], 10), parseInt(p[5], 10), 0)
            return null
        case "number":
            return Number(text)
        case "bool":
            return (!text || text.charAt(0) == "f") ? false : true
        case "id":
            return text
        case "calculate":

            return text
        default:
            if (text == null) return null
            if (text.length >= 8 && text.length <= 10 && text.match(/[0-9]+/g) && text.match(/[0-9]+/g).length == 3 && text.match(/[-/\.]/g).length == 2) return text2Value(text, defaultDateFormat)
            if (text == "true") return true
            if (text == "false") return false
            return text
    }
}

// cast yyyy-MM-dd or yyyy-MM-dd hh:mm:ss
function parserDateString(str) {
    if (str.length > 0) {
        let p = str.match(/[0-9]+/g)
        if (p == undefined) {
            return str
        }
        if (p.length == 3) {
            let y = parseInt(p[0], 10)
            y = (y < 100) ? y + 2000 : y
            return new Date(y, parseInt(p[1], 10) - 1, parseInt(p[2], 10), 0, 0, 0, 0)
        }
        if (p.length == 6) {
            let y = parseInt(p[0], 10)
            y = (y < 100) ? y + 2000 : y
            return new Date(y, parseInt(p[1], 10) - 1, parseInt(p[2], 10), parseInt(p[3], 10), parseInt(p[4], 10), parseInt(p[5], 10), 0)
        }
    }
    return str;
}

var DOCSO = function() {
    var t = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
        r = function(r, n) {
            var o = "",
                a = Math.floor(r / 10),
                e = r % 10;
            return a > 1 ? (o = " " + t[a] + " mươi", 1 == e && (o += " mốt")) : 1 == a ? (o = " mười", 1 == e && (o += " một")) : n && e > 0 && (o = " lẻ"), 5 == e && a >= 1 ? o += " lăm" : 4 == e && a >= 1 ? o += " tư" : (e > 1 || 1 == e && 0 == a) && (o += " " + t[e]), o
        },
        n = function(n, o) {
            var a = "",
                e = Math.floor(n / 100),
                n = n % 100;
            return o || e > 0 ? (a = " " + t[e] + " trăm", a += r(n, !0)) : a = r(n, !1), a
        },
        o = function(t, r) {
            var o = "",
                a = Math.floor(t / 1e6),
                t = t % 1e6;
            a > 0 && (o = n(a, r) + " triệu", r = !0);
            var e = Math.floor(t / 1e3),
                t = t % 1e3;
            return e > 0 && (o += n(e, r) + " ngàn", r = !0), t > 0 && (o += n(t, r)), o
        };
    return {
        doc: function(r) {
            if (0 == r) return t[0];
            var n = "",
                a = "";
            do ty = r % 1e9, r = Math.floor(r / 1e9), n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n, a = " tỷ"; while (r > 0);
            return n.trim()
        }
    }
}();

function doc1(value) {
    let n = Number(value);
    if (n % 1 != 0) {
        let n1 = n % 1;
        let n0 = n - n1;
        if (n1.toString().length > 5) {
            n1 = Math.round(n1 * 1000) / 1000;
        }
        n1 = n1.toString().substr(2);
        return DOCSO.doc(n0) + " phẩy " + DOCSO.doc(Number(n1));
    } else {
        return DOCSO.doc(n);
    }
}

function getCtrValue(c) {
    if (c.tagName == "INPUT") {
        if (c.type == "checkbox") {
            return c.checked
        }
        return text2Value(c.value, c.getAttribute("format"))
    }
    if (c.tagName == "TABLE") {
        if (c.tbo && c.tbo.data)
            return c.tbo.data;
        return [];
    }
    return text2Value(c.value, c.getAttribute("format"))
}

function setCtrValue(c, v) {
    if (c.tagName == "INPUT") {
        if (c.type == "checkbox") {
            if (typeof v == "string" && v.toLowerCase() == "true") v = true
            c.checked = v
            return
        }
        if (c.type == "radio") {
            if (c.value == v) c.checked = true
            return
        }
        let format = c.getAttribute("format")
        if (format != "number") {
            c.value = value2Text(v, format)
        } else {
            c.value = v
        }

    } else if (c.tagName == "TABLE") {
        grid(c, v)

    } else if (c.tagName == "TEXTAREA") {
        c.value = value2Text(v, c.getAttribute("format"))

    } else if (c.tagName == "SPAN" || c.tagName == "DIV" || c.tagName == "LABEL") {
        c.innerHTML = value2Text(v, c.getAttribute("format"))
    }
}



function grid(tb, data, options) {
    if (typeof tb == "string") {
        tb = document.querySelector(tb);
    }
    if (!tb) {
        tb = document.createElement("TABLE")
        document.body.append(tb);
    }
    let tbo = (tb.tbo) ? tb.tbo : { formats: {}, classNames: {}, titles: {}, rowEditing: -1 }

    if (options) {
        tbo = { tbo, ...options }
        if (tbo.page) {
            if (!tbo.pageSize) {
                tbo.pageSize = 10
            }
        }
        if (!tbo.formats) {
            tbo.formats = {}
        }
        if (!tbo.classNames) {
            tbo.classNames = {}
        }
        if (!tbo.titles) {
            tbo.titles = {}
        }
        if (tbo.rowEditing == undefined) {
            tbo.rowEditing = -1
        }
        if (tbo.addRow) {
            if (!tbo.formAdd) {
                tbo.formAdd = binder({ enterCommit: true })
            }
        }

    }
    tbo.refresh = function() {
        renderRows(tbo.data)
    }
    tbo.reload = function() {
        ajax(tbo.url, function(d) {
            if (tbo.sort) {
                sortData(d, tbo.sort, tbo.sorttype)
            }
            tbo.dataAll = tbo.data = d
            renderHeader(d)
            renderRows(d)
            if (tbo.onAction) {
                tbo.onAction("ajax", d[0], d, 0)
            }
        })
    }
    tbo.search = function(str) {
        if (str.length > 0) {
            let d = tbo.dataAll.filter(function(m) { return tbo.searchText(m, str.toLowerCase()) })
            tbo.data = d
            renderRows(tbo.data)
        } else {
            tbo.data = tbo.dataAll
            renderRows(tbo.data)
        }
        if (tbo.onAction) {
            tbo.onAction("search", str, tbo.data, 0)
        }
    }
    tbo.searchText = function(o, str) {
        for (let k in o) {
            let v = o[k]
            if (v != undefined) {
                if (v instanceof Date) {
                    v = value2Text(v, defaultDateFormat)
                }
                if (v.toString().toLowerCase().indexOf(str) >= 0) return true
            }
        }
        return false
    }
    tb.tbo = tbo
    if (typeof data == "string") {
        tbo.url = data
        tbo.reload()
        return tbo;
    }
    tbo.dataAll = tbo.data = data


    function renderHeader(data) {
        let thead = tb.querySelector("thead");
        // console.log(thead)
        if (!thead) {
            thead = document.createElement("THEAD")
            tb.appendChild(thead)
            let row0 = document.createElement("TR")
            thead.appendChild(row0)
            if (tbo.columns) {
                tbo.columns.forEach(function(col) {
                    let th = document.createElement("TH");
                    th.setAttribute("format", col.format)
                    th.innerHTML = capitalizeFirstLetter(col.title)
                    row0.appendChild(th)
                })
            } else {
                if (!Array.isArray(data) || data.length == 0) return
                let r0 = data[0]
                let columns = []
                if (r0 == 0) return
                if (tbo.firstcolumn) {
                    let h = document.createElement("TH")
                    h.innerHTML = capitalizeFirstLetter(tbo.firstcolumn.title)
                    row0.appendChild(h)
                    columns.push(tbo.firstcolumn)
                }
                Object.keys(r0).forEach(function(k) {
                    let col = { title: k, name: k, sortable: true, action: "" }
                    if (tbo.formats[k]) {
                        col.format = tbo.formats[k]
                    }
                    if (tbo.classNames[k]) {
                        col.className = tbo.classNames[k]
                    }
                    if (tbo.titles[k]) {
                        col.title = tbo.titles[k]
                    }
                    columns.push(col);
                    let h = document.createElement("TH")
                    h.setAttribute("name", col.name)
                    h.setAttribute("sortable", col.sortable)
                    h.setAttribute("action", col.action)
                    h.innerHTML = capitalizeFirstLetter(col.title)
                    row0.appendChild(h)
                })
                if (tbo.lastcolumn) {
                    let h = document.createElement("TH")
                    h.innerHTML = capitalizeFirstLetter(tbo.lastcolumn.title)
                    row0.appendChild(h)
                    columns.push(tbo.lastcolumn)
                }
                tbo.columns = columns
            }

        } else {

        }
        if (tbo.columns === undefined) {
            let row0 = thead.querySelector("TR");
            let columns = []
            row0.querySelectorAll("TH").forEach((th) => {
                let k = th.getAttribute("name") || th.innerHTML

                let col = { title: k, name: k, format: th.getAttribute("format") }
                let p = th.getAttribute("action")
                if (p) {
                    col.action = p
                }
                p = th.getAttribute("className")
                if (p) {
                    col.className = p
                }
                p = th.getAttribute("sortable")
                if (p) {
                    col.sortable = p
                }
                p = th.getAttribute("render")
                if (p && window[p] && typeof window[p] == "function") {
                    col.render = window[p]
                }
                columns.push(col);
            })
            if (tbo.lastcolumn) {
                let h = document.createElement("TH")
                h.innerHTML = capitalizeFirstLetter(tbo.lastcolumn.title)
                row0.appendChild(h)
                columns.push(tbo.lastcolumn)
            }
            tbo.columns = columns
        }

        let sortbtn = tb.querySelectorAll("TH").forEach(function(th) {
            if (th.getAttribute("sortable")) {
                th.classList.toggle("sorting", "true")
                th.addEventListener("click", function() {
                    sortClick(th, tbo.data)
                })
            }
        })
        if (tbo.editRow) {
            if (!tbo.formEdit) {
                tbo.formEdit = binder({ enterCommit: true })
                tbo.formEdit.onChange = function() {
                    tbo.onAction("change", tbo.formEdit.data, tbo.data, tbo.rowEditing)
                }
                tbo.columns.forEach(function(col) {
                    let inp = document.createElement("INPUT")
                    inp.className = "form-control form-control-sm shadow-none " + col.className
                    inp.placeholder = col.title
                    inp.setAttribute("format", col.format)
                    tbo.formEdit.add(inp, col.name, 2)
                })
            }
        }
    }

    function renderRows(data) {

        let tbody = tb.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement("TBODY");
            tb.append(tbody)
        }
        tbody.innerHTML = ""
        if (Array.isArray(data) && data.length > 0) {
            let st = 0;
            let end = data.length;
            if (tbo.page) {
                st = (tbo.page - 1) * tbo.pageSize
                if (st > data.length) return;
                end = Math.min(data.length, st + tbo.pageSize)
            }
            for (let i = st; i < end; i++) {
                let r = data[i]
                let row = document.createElement("TR")
                tbo.columns.forEach(function(col) {
                    let td = document.createElement("TD");
                    td.setAttribute("format", col.format)
                    renderCell(row, td, r, col, i)
                })
                tbody.appendChild(row)
            }
        }

        if (tbo.addRow) {
            let row = document.createElement("TR")
            renderInput(row, tbo.addRow, data, 0)
            tbody.appendChild(row)
        }
        renderPaging(data)
    }

    function renderCell(row, td, r, col, i) {

        if (col.className) {
            td.classList.add(col.className)
        }
        td.refresh = function() {
            myCell(td, col, r, data, i)
        }
        td.refresh()
        let cellclick = null
        if (col.cellclick && typeof col.cellclick == "function") {
            cellclick = col.cellclick
        } else {
            if (tbo.cellclick && typeof tbo.cellclick == "function") {
                cellclick = tbo.cellclick
            }
        }
        if (cellclick) {
            td.addEventListener("click", function() {
                if (tbo.binder) {
                    tbo.binder.setData(r)
                }
                cellclick(r, data, i, col, tbo)
            })
        }
        if (tbo.editRow && !col.action) {
            td.addEventListener("click", function() {
                if (tbo.currentCell && tbo.currentCell != td) {
                    tbo.currentCell.refresh()
                }
                if (!td.querySelector("INPUT")) {
                    td.innerHTML = ""
                    tbo.rowEditing = i
                    myInput(this, col, r, data, i)
                }
            })
        }
        row.appendChild(td)
    }

    function renderAction(action, td, r, data, i) {
        if (action.indexOf(',') > 0) {
            let acs = action.split(',')
            for (let ac of acs) {
                renderAction(ac, td, r, data, i)
            }
            return
        }
        switch (action) {
            case "checkbox":
                let cb = document.createElement("INPUT")
                cb.type = "checkbox"
                td.append(cb)
                if (tbo.selected == undefined) {
                    tbo.selected = []
                }
                cb.checked = tbo.selected.indexOf(r) >= 0
                cb.addEventListener("click", function() {
                    if (tbo.selected.indexOf(r) >= 0) {
                        tbo.selected.slice(tbo.selected.indexOf(r), 1)
                    } else {
                        tbo.selected.push(r)
                    }
                })
                break;
            case "no":
                td.appendChild(document.createTextNode(i + 1))
                break;
            case "space":
                td.appendChild(document.createTextNode(" "))
                break;
            default:
                let btn = document.createElement("BUTTON")
                btn.innerText = capitalizeFirstLetter(action)
                btn.className = "btn btn-outline-primary btn-sm"
                if (tbo.onAction)
                    btn.addEventListener("click", function() {
                        tbo.onAction(action, r, data, i)
                    })
                td.appendChild(btn)
                td.appendChild(document.createTextNode(" "))
                break;
        }


    }

    function renderPaging(data) {
        if (tbo.page) {
            let paging = tb.nextElementSibling
            if (!paging || paging.id != "paging") {


                tb.insertAdjacentHTML("afterend", `<nav id="paging"><ul class="pagination"></ul></nav>`)
                paging = tb.nextElementSibling
            }
            let ul = paging.querySelector(".pagination")
            let end = Math.ceil(data.length / tbo.pageSize)
            let ss = ""
            for (let i = 0; i < end; i++) {
                let pp = i + 1
                ss += `<li class="page-item ${(pp==tbo.page)?"active":""}"><a class="page-link" href="#" >${pp}</a></li>`
            }
            ss += '<li class="page-item"><select title="Page Size" class="page-link" id="pagesize">' + [5, 10, 20, 50, 100].map(ps => `<option value="${ps}" ${(ps==tbo.pageSize)?"selected":""} >${ps}</option>`).join() + '</select></li>'
            ss += `<li class="page-item"><i class="page-link">Count : ${tbo.data.length}</i></li>`
            ul.innerHTML = ss
            ul.querySelectorAll("a").forEach((a) => a.addEventListener("click", function() {
                tbo.page = this.innerHTML;
                renderRows(data)
            }))
            ul.querySelector("#pagesize").addEventListener("change", function() {
                tbo.pageSize = parseInt(this.value);
                tbo.refresh()
            })
        }
    }

    function myInput(td, col, r, data, i) {
        let formEdit = tbo.formEdit

        let inp = formEdit.ctrs[col.name]
        formEdit.setData(r)
        td.appendChild(inp)
        tbo.currentCell = td
        inp.focus()
    }

    function myCell(td, col, r, data, i) {
        if (col.html) {
            td.innerHTML = col.html
        } else if (col.render && typeof col.render == "function") {
            td.innerHTML = col.render(r, data, i)
        } else if (col.action) {
            renderAction(col.action, td, r, data, i)
        } else {
            td.innerHTML = value2Text(r[col.name], col.format)
        }
    }

    function renderInput(tr, r) {
        let formAdd = tbo.formAdd
        if (!formAdd) {
            formAdd = binder()
            tbo.formAdd = formAdd
        }
        let td = null
        tbo.columns.forEach(function(col) {
            td = document.createElement("TD");
            if (col.name) {
                if (formAdd.ctrs[col.name]) {
                    let inp = formAdd.ctrs[col.name]
                    td.appendChild(inp)
                } else {
                    let inp = document.createElement("INPUT")
                    inp.className = "form-control form-control-sm shadow-none " + col.className
                    inp.placeholder = col.title
                    inp.setAttribute("format", col.format)
                    if (r[col.name])
                        inp.value = r[col.name]
                    td.appendChild(inp)
                    formAdd.add(inp, col.name, 2)
                }

            }
            tr.appendChild(td)
        })
        renderAction("add", td, r, data, 0)
    }

    function sortClick(th, data) {
        let n = th.getAttribute("name")
        if (tbo.sort != n) {
            tbo.sort = n
            tbo.sorttype = "asc"
            th.className = "sorting sorting_asc"
        } else {
            if (tbo.sorttype == "asc") {
                tbo.sorttype = "des"
                th.className = "sorting sorting_desc"
            } else {
                tbo.sorttype = "asc"
                th.className = "sorting sorting_asc"
            }
            tbo.sort = n
        }
        if (tbo.sort) {
            sortData(data, tbo.sort, tbo.sorttype)
        }
        tbo.data = data
        renderRows(data)
    }

    if (tbo.sort) {
        sortData(data, tbo.sort, tbo.sorttype)
    }


    renderHeader(data)
    renderRows(data)
    if (tbo.onAction) {
        tbo.onAction("data", data[0], data, 0)
    }
    return tbo
}



function binder(options) {
    let bi = { data: {}, maps: [], ctrs: {} }
    if (options) {
        bi = {...bi, ...options }
    }

    bi.add = function(selector, field, type) {
        let el = selector
        if (typeof selector === "string") {
            el = document.querySelector(selector)
        }
        el.addEventListener("change", (e) => {
            el.isChanged = true;
            if (bi.onChange) {
                bi.onChange(el, bi.data[field], field, bi.data)
            }
        })
        el.setValue = function(value) {
            setCtrValue(el, value)
        }

        el.getValue = function() {
            return getCtrValue(el)
        }
        el.commit = function() {
            bi.data[field] = el.getValue()
        }

        if (bi.enterCommit) {
            el.addEventListener("keydown", function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault()
                    bi.data[field] = el.getValue()
                    if (bi.onChange) {
                        bi.onChange(el, bi.data[field], field, bi.data)
                    }
                }
            })
        }
        let b = { el: el, field: field, type: type }
        bi.maps.push(b)
        bi.ctrs[field] = el
    }
    bi.addAuto = function(selector) {
        let els = selector
        if (typeof selector === "string") {
            els = document.querySelectorAll(selector)
        }
        els.forEach(el => {
            let type = 2
            if (el.getAttribute("readonly")) {
                type = 1
            }
            if (el.getAttribute("pname")) {
                let pname = el.getAttribute("pname")
                if (bi.child == undefined) {
                    bi.child = {};
                }
                if (bi.child[pname] == undefined) {
                    bi.child[pname] = binder()
                }
                let bi1 = bi.child[pname]
                bi1.parent = bi
                bi1.pname = pname
                bi1.index = -1
                bi1.add(el, el.getAttribute("name") || el.id, type)
            } else {
                bi.add(el, el.getAttribute("name") || el.id, type)
            }
        });
    }

    bi.onSet = function(el, value, m) {
        setCtrValue(el, value)
        if (bi.onSetValue) {
            bi.onSetValue(el, value, m.field)
        }
    }
    bi.setData = function(data) {
        bi.data = data
        bi.maps.forEach(m => {
            if (m.calculate && typeof m.calculate == "function") {
                let vv = m.calculate(data, m)
                bi.onSet(m.el, vv, m)
            } else {
                bi.onSet(m.el, data[m.field], m)
            }
            m.el.isChanged = false
        })
    }
    bi.set = function(field, value) {
        if (bi.ctrs[field]) {
            bi.onSet(bi.ctrs[field], value, bi.ctrs[field])
            bi.ctrs[field].isChanged = true
        }
    }
    bi.update = function(field, value) {
        if (bi.ctrs[field]) {
            let el = bi.ctrs[field]
            setCtrValue(el, value)
            bi.data[field] = value
            el.isChanged = true
            if (bi.onChange) {
                bi.onChange(el, bi.data[field], field, bi.data)
            }
        }
    }
    bi.setField = function(data) {
        bi.maps.forEach(m => {
            if (data[m.field] !== undefined)
                bi.onSet(m.el, data[m.field], m)
        })
    }
    bi.clear = function() {
        bi.maps.forEach(m => {
            setCtrValue(m.el, "")
        })
    }
    bi.getField = function(name) {
        for (m of bi.maps) {
            if (m.field == name) {
                return getCtrValue(m.el);
            }
        }
    }
    bi.getData = function() {
        let data = {};
        bi.maps.forEach(m => {
            if (m.el.tagName == "TABLE") {
                data[m.field] = m.el.tbo.data;
            } else {
                data[m.field] = (m.el.isChanged) ? getCtrValue(m.el) : bi.data[m.field]
            }
        })
        return data;
    }
    bi.getData2 = function() {
        let data = {};
        bi.maps.forEach(m => {
            if (m.type == 2) {
                if (m.el.tagName == "TABLE") {
                    data[m.field] = bi.data[m.field];
                } else {
                    data[m.field] = (m.el.isChanged) ? getCtrValue(m.el) : bi.data[m.field]
                }
            }
        })
        return data;
    }
    bi.commit = function() {
        bi.maps.forEach(m => {
            if (m.type == 2 && m.el.isChanged) {
                bi.data[m.field] = getCtrValue(m.el)
            }
        })
    }

    bi.check = function() {
        let error = ""
        bi.maps.forEach(m => {
            if (m.type == 2) {
                let v = null;
                let bb = false;
                if (m.el.tagName == "TABLE") {
                    // if (m.el.tbo)
                    //     data[m.field] = m.el.tbo.data;
                } else {
                    v = (m.el.isChanged) ? getCtrValue(m.el) : bi.data[m.field]
                }
                if (m.check && typeof m.check == "function") {
                    if (!m.check(v)) {
                        error += m.field
                        bb = true
                    }
                }
                if (m.el.required) {
                    if (v == null || v == "" || v == 0) {
                        error += m.field + " is null;"
                        m.el.focus()
                        bb = true
                    }
                }
                if (m.el.tagName == "INPUT" && !m.el.checkValidity()) {
                    error += m.field
                    bb = true
                }
                m.el.classList.toggle("is-invalid", bb)
            }
        })
        return error;
    }
    bi.getDataChanged = function() {
        let data = {};
        bi.maps.forEach(m => {
            //console.log(m.el.isChanged);
            if (m.el.isChanged) {
                data[m.field] = getCtrValue(m.el)
            }
        })
        return data;
    }
    bi.addRow = function(field, row) {
        if (bi.data[field] == undefined) {
            bi.data[field] = []
        }
        if (bi.data[field] && Array.isArray(bi.data[field])) {
            let arr = bi.data[field]
            arr.push(row)
            bi.ctrs[field].isChanged = true
            if (bi.onChangeRow) {
                bi.onChangeRow(bi.ctrs[field], arr, field, bi.data)
            }
            bi.set(field, arr)

        }
    }
    bi.updateRow = function(field, row, index) {
        if (bi.data[field] == undefined) {
            bi.data[field] = []
        }
        if (bi.data[field] && Array.isArray(bi.data[field])) {
            let arr = bi.data[field]
            if (index < arr.length && index >= 0) {
                let orow = arr[index]
                arr[index] = { orow, ...row }
                bi.ctrs[field].isChanged = true
                if (bi.onChangeRow) {
                    bi.onChangeRow(bi.ctrs[field], arr, field, bi.data)
                }
                bi.set(field, arr)
            }
        }
    }
    bi.deleteRow = function(field, index) {
        if (bi.data[field] == undefined) {
            bi.data[field] = []
        }
        if (bi.data[field] && Array.isArray(bi.data[field])) {
            let arr = bi.data[field]
            if (index < arr.length && index >= 0) {
                arr.splice(index, 1)
                bi.ctrs[field].isChanged = true
                if (bi.onChangeRow) {
                    bi.onChangeRow(bi.ctrs[field], arr, field, bi.data)
                }
                bi.set(field, arr)

            }
        } else {
            bi.data[field] = []
            if (bi.onChangeRow) {
                bi.onChangeRow(bi.ctrs[field], bi.data[field], field, bi.data)
            }
            bi.set(field, bi.data[field])

        }
    }
    if (options) {
        if (options.selector) {
            bi.addAuto(options.selector);
        }
        if (options.setField) {
            bi.setField(options.setField)
        }
        if (options.setData) {
            bi.setData(options.setData)
        }
    }

    return bi;
}


function sortData(data, key, type) {
    if (data == null || !Array.isArray(data)) return
    if (type == "asc") {
        sortA(data, key);
    } else {
        sortD(data, key);
    }

    function sortA(data, key) {
        if (data.length > 1) {
            if (typeof data[0][key] == "string") {
                sortDataA(data, key);
            } else {
                sortDataNumberA(data, key);
            }
        }
    }

    function sortD(data, key) {
        if (data.length > 1) {
            if (typeof data[0][key] == "string") {
                sortDataD(data, key);
            } else {
                sortDataNumberD(data, key);
            }
        }
    }


    function sortDataNumberA(data, key) {
        data.sort(function(a, b) {
            if (a[key] == undefined) {
                return -1;
            }
            if (b[key] == undefined) {
                return 1;
            }
            return b[key] - a[key]
        });
    }

    function sortDataNumberD(data, key) {
        data.sort(function(a, b) {
            if (a[key] == undefined) {
                return 1;
            }
            if (b[key] == undefined) {
                return -1;
            }
            return a[key] - b[key]
        });
    }

    function sortDataA(data, key) {
        data.sort(function(a, b) {
            if (a[key] == undefined) {
                return -1;
            }
            if (b[key] == undefined) {
                return 1;
            }
            if (a[key].toLowerCase) {
                return b[key].localeCompare(a[key]);
                // n1 = a[key].toLowerCase();
                // if (b[key].toLowerCase)
                //     n2 = b[key].toLowerCase();
                // if (n1 < n2) {
                //     return 1;
                // }
                // if (n1 > n2) {
                //     return -1;
                // }
            }
            return 0;
        });
    }

    function sortDataD(data, key) {
        data.sort(function(a, b) {
            if (a[key] == undefined) {
                return 1;
            }
            if (b[key] == undefined) {
                return -1;
            }
            if (a[key].toLowerCase) {
                return a[key].localeCompare(b[key]);
                // n1 = a[key].toLowerCase();
                // if (b[key].toLowerCase)
                //     n2 = b[key].toLowerCase();
                // if (n1 < n2) {
                //     return -1;
                // }
                // if (n1 > n2) {
                //     return 1;
                // }
            }
            return 0;
        });
    }

}


function filterData(data, key, type, value) {
    switch (type) {
        case "Con":
            let vv = value.split(',');
            return data.filter(function(d) {
                let kq = false;
                vv.forEach(function(v) {
                    kq = kq || d[key].toString().indexOf(v) >= 0;
                })
                return kq;
            })
        case "con":
            return data.filter(function(d) {
                let kq = false;
                value.toLowerCase().split(',').forEach(function(v) {
                    kq = kq || d[key].toString().toLowerCase().indexOf(v) >= 0;
                })
                return kq;
            })
        case "In":
            return data.filter(function(d) {
                let kq = false;
                value.split(',').forEach(function(v) {
                    kq = kq || d[key] == v;
                })
                return kq;
            })
        case "in":
            return data.filter(function(d) {
                let kq = false;
                value.toLowerCase().split(',').forEach(function(v) {
                    kq = kq || d[key].toString().toLowerCase() == v;
                })
                return kq;
            })
        case "notin":
            let vv2a = value.split(',');
            return data.filter(function(d) {
                let kq = false;
                vv2a.forEach(function(v) {
                    kq = kq || d[key] == v;
                })
                return !kq;
            })
        case "notcon":
            let vv1 = value.split(',');
            return data.filter(function(d) {
                let kq = false;
                vv1.forEach(function(v) {
                    kq = kq || d[key].toString().indexOf(v) >= 0;
                })
                return !kq;
            })
        case "=":
        case "eq":
            return data.filter(function(d) {
                return d[key] == value;
            })
        case "<>":
        case "!=":
        case "noteq":
            return data.filter(function(d) {
                return d[key] != value;
            })
        case ">":
        case "gt":
            return data.filter(function(d) {
                return d[key] > value;
            })
        case "<":
        case "lt":
            return data.filter(function(d) {
                return d[key] < value;
            })
        case ">=":
        case "gteq":
            return data.filter(function(d) {
                return d[key] >= value;
            })
        case "<=":
        case "lteq":
            return data.filter(function(d) {
                return d[key] <= value;
            })
        case "bw":
            if (value.indexOf("-") > 0 || value.indexOf("/") > 0) {
                let ddd = value.split(",");
                let d1 = str2Date(ddd[0]);
                let d2 = str2Date(ddd[1]);
                return data.filter(function(d) {
                    return d[key] >= d1 && d[key] <= d2;
                })
            } else {
                let nnn = value.split(",");
                let v1 = Number(nnn[0]);
                let v2 = Number(nnn[1]);
                return data.filter(function(d) {
                    return d[key] >= v1 && d[key] <= v2;
                })
            }
        default:
            value = value.toLowerCase();
            return data.filter(function(d) {
                if (!d[key]) return false;
                return d[key].toString().toLowerCase().indexOf(value) >= 0;
            })
    }
}

function restful(url, binder, options) {
    let rest = {}

    if (options) {
        rest = {...rest, ...options }
    }


    rest.get = function(id) {
        if (id < 0) {
            ajax(url + "/index/" + id, function(d) {
                binder.setData(d)
                binder.check()
            })
        } else {
            ajax(url + "/" + id, function(d) {
                binder.setData(d)
                binder.check()
            })
        }

    }
    rest.getAll = function(el) {
        ajax(url, function(d) {
            setCtrValue(el, d)
        })
    }
    rest.getPage = function(el, page) {
        ajax(url + "/page/" + page, function(d) {
            setCtrValue(el, d)
        })
    }
    rest.getPageNew = function(el, page) {
        ajax(url + "/pagenew/" + page, function(d) {
            setCtrValue(el, d)
        })
    }
    rest.getSearch = function(el, search) {
        ajax(url + "/search/" + search, function(d) {
            setCtrValue(el, d)
        })
    }
    rest.post = function() {
        if (binder.check().length > 0) return
        ajax1("POST", url, binder.getData2(), function(d) {
            binder.setData(d);
            if (rest.success) {
                rest.success("Add", d)
            } else {
                console.log("Add Successful")
            }
        })
    }
    rest.put = function() {
        if (binder.check().length > 0) return
        console.log(binder.getField("id"), binder.getData2());
        ajax1("PUT", url + "/" + binder.getField("id"), binder.getData2(), function(d) {
            binder.setData(d);
            if (rest.success) {
                rest.success("Update", d)
            } else {
                console.log("Update Successful")
            }
        })
    }
    rest.delete = function() {
        ajax1("DELETE", url + "/" + binder.getField("id"), binder.getData(), function(d) {
            binder.setData(d);
            if (rest.success) {
                rest.success("Delete", d)
            } else {
                console.log("Delete Successful")
            }
        })
    }
    return rest;
}

function include() {
    document.querySelectorAll("[include]").forEach(p => {
        let url = p.getAttribute("include");
        fetch(url)
            .then(res => res.text())
            .then(function(text) {
                p.insertAdjacentHTML("beforeend", text)
                loadScript(text)
            });
    })
}


function loadTemplate() {
    let sss = "";
    document.querySelectorAll("template").forEach(function(t) {
        let param = t.getAttribute("param") || "item,data"
        sss += `tem.${t.id}=(${param})=>\`${t.innerHTML}\`;`;
    })

    let sc = document.querySelector("#scripttem");
    if (sc !== null) {
        sc.remove();
    }
    sc = document.createElement("script");
    sc.id = "scripttem";
    sc.type = "text/javascript";
    sc.innerHTML = sss;
    document.body.appendChild(sc);
}

function loadScript(html) {
    var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    var match;
    while (match = re.exec(html)) {
        let sc = document.createElement("script");
        sc.id = "scripttem";
        sc.type = "text/javascript";
        sc.innerHTML = match[1];
        document.body.appendChild(sc);
    }
}

function datalist(selector, url, onchange) {
    let el = (typeof selector == "string") ? document.querySelector(selector) : selector
    let key = el.id + "_datalist"
    el.setAttribute("list", key)
    let ls = document.createElement("datalist");
    ls.id = key
    if (onchange)
        el.addEventListener('input', function() {
            let val = el.value;
            let options = ls.childNodes;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === val) {
                    onchange(val, options[i].data)
                    break;
                }
            }
        });
    document.body.appendChild(ls)
    fetch(url)
        .then(res => res.text())
        .then(function(text) {
            let data = JSON.parse(text)
            data.forEach(d => {
                let o = document.createElement("option")
                o.value = d.id
                o.data = d
                o.text = d.name
                ls.appendChild(o)
            })
        });


}



var gridFormconf = {
    firstcolumn: { action: "no" },
    lastcolumn: { action: "Select,X" },
    onAction: function(action, r, d, i) {
        let tbo = this;
        if (action == "Select") {
            tbo.form.index = i
            tbo.form.setData(r)
        }
        if (action == "X") {
            tbo.form.parent.deleteRow(tbo.form.pname, i)
        }
    }
}

function formBuilder(el, data, options) {
    let form = binder()
    if (typeof el == "string") {
        el = document.querySelector(el)
    }

    if (options) {
        if (options.parent) {
            form.parent = options.parent
            form.pname = options.pname
        }
        let di = document.createElement("DIV")
        di.className = "input-group"
        for (k in data) {
            let v = data[k]

            el.appendChild(di)
            if (Array.isArray(v)) {
                let tb = document.createElement("TABLE")
                di.appendChild(tb)
                grid(tb, v)
                let r0 = v[0]
                let di1 = document.createElement("DIV")
                di.appendChild(di1)
                formBuilder(di1, r0, true)
            } else {
                let inp = document.createElement("INPUT")
                di.appendChild(inp)
                inp.name = k
                inp.className = "form-control"
                inp.placeholder = k
                form.add(inp, k, 2)
            }
        }
        let btn = document.createElement("BUTTON")
        btn.innerHTML = "Add"
        btn.className = "btn btn-primary"
        el.appendChild(btn)

        btn.addEventListener("click", function() {
            form.parent.addRow(form.pname, form.getData())
            form.clear()
        })
        let btn1 = document.createElement("BUTTON")
        btn1.innerHTML = "Update"
        btn1.className = "btn"
        el.appendChild(btn1)

        btn1.addEventListener("click", function() {
                console.log(form.parent, form.getData());
                form.parent.updateRow(form.pname, form.getData(), form.index)
            })
            //form.setData(data)

    } else {
        form.data = data
        for (k in data) {
            let v = data[k]
            let di = document.createElement("DIV")
            el.appendChild(di)
            let la = document.createElement("LABEL")
            la.innerHTML = k
            di.appendChild(la)

            if (Array.isArray(v)) {
                let tb = document.createElement("TABLE")
                tb.className = "table"
                di.appendChild(tb)
                let tbo = grid(tb, v, gridFormconf)
                let r0 = v[0]
                let di1 = document.createElement("DIV")
                di.appendChild(di1)
                if (form.child == undefined) {
                    form.child = {};
                }
                form.add(tb, k, 2)
                tbo.form = form.child[k] = formBuilder(di1, r0, { arr: v, parent: form, pname: k })

            } else {
                let inp = document.createElement("INPUT")
                di.appendChild(inp)
                inp.className = "form-control"
                inp.name = k
                form.add(inp, k, 2)
            }
        }
        form.setData(data)
    }
    return form
}