"use strict";(self.webpackChunkmatrimony=self.webpackChunkmatrimony||[]).push([[3996],{24146:(e,t,n)=>{n.d(t,{A:()=>l});var a=n(34535),r=n(96446),o=n(19252),s=n(70579);const i=(0,a.Ay)(r.A)((e=>{let{theme:t}=e;return`\n        padding: ${t.spacing(1)};\n`})),l=e=>{let{children:t}=e;return(0,s.jsx)(i,{className:"MuiPageTitle-wrapper",children:(0,s.jsx)(o.A,{maxWidth:"lg",children:t})})}},94786:(e,t,n)=>{n.d(t,{A:()=>r});n(65043);var a=n(70579);const r=e=>{const{title:t}=e;return(0,a.jsx)("div",{className:"spinner-container",children:(0,a.jsx)("div",{className:"loading-spinner"})})}},53996:(e,t,n)=>{n.r(t),n.d(t,{default:()=>F});var a=n(65043),r=n(26240),o=n(96446),s=n(68903),i=n(88911),l=n(22698),d=n(85865),c=n(69392),p=n(17392),m=n(53193),h=n(18356),g=n(93088),u=n(91449),x=n(19252),b=n(12110),v=n(39336),y=n(79650),A=n(71806),j=n(84882),f=n(28076),k=n(10039),C=n(73460),w=n(11633),O=n(73216),I=n(94786),R=n(24146),S=n(33639),$=n(63709),P=n(86898),T=n(62378),z=n(29490),H=n(47503),M=(n(92342),n(35475)),N=(n(8740),n(70579));const L={data:""},F=()=>{const[e,t]=(0,a.useState)(!1);let[n,F]=(0,a.useState)(L);const[W,V]=a.useState([]),[B,G]=a.useState([]),q=(0,O.Zp)();a.useEffect((()=>{Y(),D()}),[]);const Y=()=>{let e=(new Date).getFullYear();X(e);let t=e.toString();n.data=t},D=()=>{G(B.length=0);for(let e=9;e>=0;e--){let t={data:(new Date).getFullYear()-e};B.push(t)}G(B)},X=async e=>{try{if(t(!0),e){const n=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let r={year:e};const o=await w.A.httpPost("/api/admin/report/getReceiveProposalReqReport",r,n,a);V(o.recordList),o&&200==o.status||(401==o.status?(localStorage.clear(),q("/admin")):(400==o.status||500==o.status||300==o.status||404==o.status)&&H.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:H.oR.POSITION.TOP_RIGHT})),t(!1)}}catch(n){t(!1),H.oR.error(n,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:H.oR.POSITION.TOP_RIGHT})}},E=(0,r.A)();return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(H.N9,{style:{top:"9%",left:"80%"},autoClose:6e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0}),(0,N.jsx)(z.mg,{children:(0,N.jsx)("title",{children:"Proposal Request Accept"})}),(0,N.jsx)(R.A,{children:(0,N.jsx)(o.A,{pt:1.2,pb:1.1,pl:1,children:(0,N.jsxs)(s.Ay,{container:!0,justifyContent:"space-between",alignItems:"center",spacing:1,children:[(0,N.jsx)(s.Ay,{item:!0,children:(0,N.jsx)(i.A,{alignItems:"left",justifyContent:"space-between",children:(0,N.jsxs)(l.A,{"aria-label":"breadcrumb",children:[(0,N.jsx)(M.N_,{to:"/admin",style:{display:"flex",color:"black"},children:(0,N.jsx)(S.A,{})}),(0,N.jsx)(d.A,{color:"inherit",variant:"subtitle2",fontWeight:"bold",children:"Proposal Request Accept"})]})})}),(0,N.jsxs)(s.Ay,{item:!0,children:[(0,N.jsx)(c.A,{title:"Print",arrow:!0,children:(0,N.jsx)(p.A,{sx:{"&:hover":{background:E.colors.primary.lighter},color:E.palette.primary.main,marginTop:"3px"},color:"inherit",size:"small",onClick:e=>{(async e=>{const t=localStorage.getItem("SessionToken"),n=localStorage.getItem("RefreshToken");let a={year:e};const r=await w.A.httpPost("/api/admin/report/getReceiveProposalReqReport",a,t,n);r&&200==r.status||401==r.status&&(localStorage.clear(),q("/admin"));let o='<html>\n    <div class="img-container">\n    <img src="/Image20221010173301.png" alt="logo" height="30px"/>\n    <span>Request Accept</span>\n</div>\n<div class="date-container">\n<div>';o+="<p> Year - "+e+'</p>\n      </div>\n      </div>\n  <body  onload="window.print(); window.close();">\n  <style>\n  .img-container {\n    text-align: center;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  span{\n    font-size: 30px;\n    padding-Left: 5px;\n  }\n  .date-container {\n    text-align: right;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  table {\n     border-collapse: collapse;\n    border: 1px solid black;\n    width: 100%;\n  }\n\n  .th1 {\n    border-top: 0px;\n    border-bottom: 1px solid black;\n    border-right: 1px solid black;\n    text-align: center;\n    padding: 8px;\n  }\n\n\n  .th2 {\n    border-bottom: 1px solid black;\n    border-right: 1px solid black;\n    text-align: center;\n    padding: 8px;\n  }\n\n  .th3 {\n    border-bottom: 1px solid black;\n    text-align: center;\n    padding: 8px;\n  }\n\n  .td1 {\n    border-right: 1px solid black;\n    text-align: center;\n    padding: 8px;\n  }\n\n  .td2 {\n    border-right: 1px solid black;\n    text-align: left;\n    padding: 8px;\n  }\n\n  .td3 {\n      text-align: center;\n      padding: 8px;\n    }\n\n  tr:nth-child(even) {background-color: #f2f2f2;}\n  </style>\n  <table>\n  <thead>\n  <th class="th1">#</th>\n    <th class="th2">Month</th>\n    <th class="th3">Count</th>\n  </thead>\n  <tbody>';for(let i=0;i<r.recordList.length;i++)o+='<tr>\n        <td class="td1">'+(i+1)+'</td>\n        <td class="td2">'+r.recordList[i].month+'</td>\n        <td class="td3">'+r.recordList[i].count+" </td>\n       </tr>";o+="</tbody>\n    </table>\n   </body>\n  </html >";let s=document.createElement("iframe");s.name="frame1",s.style.position="absolute",s.style.top="-1000000px",document.body.appendChild(s),s.contentWindow.document.open(),s.contentWindow.document.write(o),s.contentWindow.document.close()})(n.data)},children:(0,N.jsx)($.A,{fontSize:"medium"})})}),(0,N.jsx)(c.A,{title:"Export File",arrow:!0,children:(0,N.jsx)(p.A,{sx:{"&:hover":{background:E.colors.primary.lighter},color:E.palette.primary.main},color:"inherit",size:"small",children:(0,N.jsx)(T.CSVLink,{data:W,filename:"ReportSend.csv",style:{"&:hover":{background:E.colors.primary.lighter},color:E.palette.primary.main},children:(0,N.jsx)(P.A,{})})})}),(0,N.jsxs)(m.A,{sx:{minWidth:150,mt:{xs:0,md:0}},size:"small",children:[(0,N.jsx)(h.A,{htmlFor:"demo-customized-select-label",children:"Year"}),(0,N.jsx)(g.A,{labelId:"demo-customized-select-label",id:"demo-customized-select",name:"data",value:n.data,label:"Year",onChange:e=>{const{name:t,value:a}=e.target;F({...n,[t]:a}),X(a),n.data=a},children:B.map((e=>(0,N.jsx)(u.A,{value:e.data,children:e.data},e.data)))})]})]})]})})}),(0,N.jsx)(x.A,{maxWidth:"lg",children:(0,N.jsx)(s.Ay,{container:!0,direction:"row",justifyContent:"center",alignItems:"stretch",spacing:3,children:(0,N.jsx)(s.Ay,{item:!0,xs:12,children:(0,N.jsx)("div",{children:(0,N.jsx)(b.A,{className:"requestReportcard",children:(0,N.jsx)("div",{children:e?(0,N.jsx)(I.A,{title:"Loading..."}):(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(v.A,{}),(0,N.jsx)(y.A,{className:"requestReportTableContainer",children:(0,N.jsxs)(A.A,{stickyHeader:!0,children:[(0,N.jsx)(j.A,{children:(0,N.jsxs)(f.A,{children:[(0,N.jsx)(k.A,{align:"center",children:"Month"}),(0,N.jsx)(k.A,{align:"right",children:"Count"})]})}),(0,N.jsx)(C.A,{children:W.map(((e,t)=>(0,N.jsxs)(f.A,{hover:!0,children:[(0,N.jsx)(k.A,{align:"center",children:(0,N.jsx)(d.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,children:e.month})}),(0,N.jsx)(k.A,{align:"right",children:(0,N.jsx)(d.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,children:e.count})})]},t)))})]})})]})})})})})})})]})}},63709:(e,t,n)=>{var a=n(24994);t.A=void 0;var r=a(n(40039)),o=n(70579),s=(0,r.default)((0,o.jsx)("path",{d:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"}),"Print");t.A=s},86898:(e,t,n)=>{var a=n(24994);t.A=void 0;var r=a(n(40039)),o=n(70579),s=(0,r.default)((0,o.jsx)("path",{d:"m19.41 7.41-4.83-4.83c-.37-.37-.88-.58-1.41-.58H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.42zM14.8 15H13v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H9.21c-.45 0-.67-.54-.35-.85l2.8-2.79c.2-.19.51-.19.71 0l2.79 2.79c.3.31.08.85-.36.85zM14 9c-.55 0-1-.45-1-1V3.5L18.5 9H14z"}),"UploadFileRounded");t.A=s},91449:(e,t,n)=>{n.d(t,{A:()=>O});var a=n(98587),r=n(58168),o=n(65043),s=n(69292),i=n(98610),l=n(67266),d=n(34535),c=n(61475),p=n(98206),m=n(51347),h=n(75429),g=n(55013),u=n(95849),x=n(5658),b=n(92532);const v=(0,b.A)("MuiListItemIcon",["root","alignItemsFlexStart"]);var y=n(28052),A=n(72372);function j(e){return(0,A.Ay)("MuiMenuItem",e)}const f=(0,b.A)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]);var k=n(70579);const C=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],w=(0,d.Ay)(h.A,{shouldForwardProp:e=>(0,c.A)(e)||"classes"===e,name:"MuiMenuItem",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.dense&&t.dense,n.divider&&t.divider,!n.disableGutters&&t.gutters]}})((e=>{let{theme:t,ownerState:n}=e;return(0,r.A)({},t.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!n.disableGutters&&{paddingLeft:16,paddingRight:16},n.divider&&{borderBottom:`1px solid ${(t.vars||t).palette.divider}`,backgroundClip:"padding-box"},{"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${f.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity),[`&.${f.focusVisible}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.focusOpacity}))`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},[`&.${f.selected}:hover`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:(0,l.X4)(t.palette.primary.main,t.palette.action.selectedOpacity)}},[`&.${f.focusVisible}`]:{backgroundColor:(t.vars||t).palette.action.focus},[`&.${f.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity},[`& + .${x.A.root}`]:{marginTop:t.spacing(1),marginBottom:t.spacing(1)},[`& + .${x.A.inset}`]:{marginLeft:52},[`& .${y.A.root}`]:{marginTop:0,marginBottom:0},[`& .${y.A.inset}`]:{paddingLeft:36},[`& .${v.root}`]:{minWidth:36}},!n.dense&&{[t.breakpoints.up("sm")]:{minHeight:"auto"}},n.dense&&(0,r.A)({minHeight:32,paddingTop:4,paddingBottom:4},t.typography.body2,{[`& .${v.root} svg`]:{fontSize:"1.25rem"}}))})),O=o.forwardRef((function(e,t){const n=(0,p.b)({props:e,name:"MuiMenuItem"}),{autoFocus:l=!1,component:d="li",dense:c=!1,divider:h=!1,disableGutters:x=!1,focusVisibleClassName:b,role:v="menuitem",tabIndex:y,className:A}=n,f=(0,a.A)(n,C),O=o.useContext(m.A),I=o.useMemo((()=>({dense:c||O.dense||!1,disableGutters:x})),[O.dense,c,x]),R=o.useRef(null);(0,g.A)((()=>{l&&R.current&&R.current.focus()}),[l]);const S=(0,r.A)({},n,{dense:I.dense,divider:h,disableGutters:x}),$=(e=>{const{disabled:t,dense:n,divider:a,disableGutters:o,selected:s,classes:l}=e,d={root:["root",n&&"dense",t&&"disabled",!o&&"gutters",a&&"divider",s&&"selected"]},c=(0,i.A)(d,j,l);return(0,r.A)({},l,c)})(n),P=(0,u.A)(R,t);let T;return n.disabled||(T=void 0!==y?y:-1),(0,k.jsx)(m.A.Provider,{value:I,children:(0,k.jsx)(w,(0,r.A)({ref:P,role:v,tabIndex:T,component:d,focusVisibleClassName:(0,s.A)($.focusVisible,b),className:(0,s.A)($.root,A)},f,{ownerState:S,classes:$}))})}))},8740:()=>{}}]);
//# sourceMappingURL=3996.80985e2a.chunk.js.map