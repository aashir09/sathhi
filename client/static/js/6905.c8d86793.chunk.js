"use strict";(self.webpackChunkmatrimony=self.webpackChunkmatrimony||[]).push([[6905],{24146:(e,t,s)=>{s.d(t,{A:()=>l});var a=s(34535),i=s(96446),o=s(19252),n=s(70579);const r=(0,a.Ay)(i.A)((e=>{let{theme:t}=e;return`\n        padding: ${t.spacing(1)};\n`})),l=e=>{let{children:t}=e;return(0,n.jsx)(r,{className:"MuiPageTitle-wrapper",children:(0,n.jsx)(o.A,{maxWidth:"lg",children:t})})}},94786:(e,t,s)=>{s.d(t,{A:()=>i});s(65043);var a=s(70579);const i=e=>{const{title:t}=e;return(0,a.jsx)("div",{className:"spinner-container",children:(0,a.jsx)("div",{className:"loading-spinner"})})}},6905:(e,t,s)=>{s.r(t),s.d(t,{default:()=>K});var a=s(29490),i=s(24146),o=s(34535),n=s(83462),r=s(26600),l=s(17392),d=s(26240),c=s(96446),h=s(68903),g=s(88911),m=s(22698),u=s(85865),p=s(11906),x=s(53193),A=s(67784),j=s(51787),v=s(19252),y=s(12110),S=s(39336),f=s(79650),b=s(71806),P=s(84882),C=s(28076),I=s(10039),H=s(73460),k=s(69392),R=s(4598),T=s(92598),O=s(63336),w=s(35316),N=s(98533),z=s(29347),W=s(81673),M=s(26688),B=s(39155),F=s(74802),_=s(33639),G=s(73216),L=s(35475),D=s(65043),E=s(11633),q=s(94786),U=s(66360),$=s(47503),J=(s(92342),s(8740),s(70579));const V=(0,o.Ay)(n.A)((e=>{let{theme:t}=e;return{"& .MuiDialogContent-root":{padding:t.spacing(2)},"& .MuiDialogActions-root":{padding:t.spacing(1)},"& .MuiPaper-root":{height:"260px"}}}));function Y(e){const{children:t,onClose:s,...a}=e;return(0,J.jsxs)(r.A,{sx:{m:0,p:2,fontSize:"18px",fontWeight:"bold"},...a,children:[t,s?(0,J.jsx)(l.A,{"aria-label":"close",onClick:s,sx:{position:"absolute",right:13,top:13,color:e=>e.palette.grey[500]},children:(0,J.jsx)(F.A,{})}):null]})}const Z={id:0,name:""};const K=function(){const[e,t]=(0,D.useState)(0),[s,o]=(0,D.useState)(10),[F,K]=(0,D.useState)(10),[Q,X]=D.useState([]),[ee,te]=D.useState(!1),[se,ae]=(0,D.useState)(!1),[ie,oe]=D.useState(Z),[ne,re]=(0,D.useState)(!1),[le,de]=(0,D.useState)(""),[ce,he]=(0,D.useState)(!1),[ge,me]=(0,D.useState)(!1),[ue,pe]=(0,D.useState)("");let[xe,Ae]=(0,D.useState)("");const je=(0,G.Zp)();let[ve,ye]=(0,D.useState)();const[Se,fe]=(0,D.useState)(!0),[be,Pe]=(0,D.useState)(!0),[Ce,Ie]=(0,D.useState)(!0),[He,ke]=(0,D.useState)(!0);D.useEffect((()=>{let e=JSON.parse(localStorage.getItem("Credentials"));if(ye(e),e)if(1!=e.roleId){let t=e.pagePermissions.findIndex((e=>"Block Users"===e.title));t>=0&&(fe(e.pagePermissions[t].isReadPermission),Pe(e.pagePermissions[t].isAddPermission),Ie(e.pagePermissions[t].isEditPermission),ke(e.pagePermissions[t].isDeletePermission),e.pagePermissions[t].isReadPermission&&Re())}else Re()}),[]);const Re=async()=>{ze(e,s),te(!1)},Te=new RegExp("^[0-9]{1,3}$"),Oe=()=>{te(!1)},we=async()=>{oe(Z),re(!1),de(""),te(!0),me(!1),pe("")},Ne=()=>{he(!1)},ze=async(e,t)=>{try{if(xe){const s=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={startIndex:e,fetchRecord:t,name:xe||""};const o=await E.A.httpPost("/api/admin/height/getHeight",i,s,a);X(o.recordList),K(o.totalRecords)}else{ae(!0);const s=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={startIndex:e,fetchRecord:t};const o=await E.A.httpPost("/api/admin/height/getHeight",i,s,a);X(o.recordList),K(o.totalRecords),o&&200==o.status?te(!1):401==o.status?(localStorage.clear(),je("/admin")):(500==o.status||400==o.status||300==o.status||404==o.status)&&(te(!1),$.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT})),ae(!1)}}catch(s){te(!1),$.oR.error(s,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT}),ae(!1)}},We=(0,d.A)();return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)($.N9,{style:{top:"10%",left:"80%"},autoClose:6e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0}),(0,J.jsx)(a.mg,{children:(0,J.jsx)("title",{children:"Height"})}),(0,J.jsx)(i.A,{children:(0,J.jsx)(c.A,{p:1,children:(0,J.jsxs)(h.Ay,{container:!0,justifyContent:"space-between",alignItems:"center",children:[(0,J.jsx)(h.Ay,{item:!0,children:(0,J.jsx)(g.A,{alignItems:"left",justifyContent:"space-between",children:(0,J.jsxs)(m.A,{"aria-label":"breadcrumb",children:[(0,J.jsx)(L.N_,{to:"/admin",style:{display:"flex",color:"black"},children:(0,J.jsx)(_.A,{})}),(0,J.jsx)(u.A,{color:"inherit",variant:"subtitle2",fontWeight:"bold",children:"Height"})]})})}),(0,J.jsx)(h.Ay,{item:!0,children:(0,J.jsxs)(h.Ay,{container:!0,spacing:1.5,children:[(0,J.jsx)(h.Ay,{item:!0,children:be?(0,J.jsxs)(J.Fragment,{children:[(0,J.jsxs)(p.A,{className:"buttonLarge",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:we,size:"small",children:[(0,J.jsx)(B.A,{fontSize:"small"}),"Create Height"]}),(0,J.jsx)(p.A,{className:"button",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:we,size:"small",children:(0,J.jsx)(B.A,{fontSize:"small"})})]}):(0,J.jsx)(J.Fragment,{})}),(0,J.jsx)(h.Ay,{item:!0,children:(0,J.jsx)(x.A,{sx:{mt:{xs:.3,md:.3,lg:.3,sm:.3}},children:(0,J.jsx)(A.A,{name:"searchString",value:xe,onChange:t=>(t=>{Ae(t.target.value),xe=t.target.value,ze(e,s)})(t),id:"outlined-basic",label:"Search",variant:"outlined",size:"small",InputProps:{startAdornment:(0,J.jsx)(j.A,{position:"start",children:(0,J.jsx)(U.A,{})})}})})})]})})]})})}),(0,J.jsx)(v.A,{maxWidth:"lg",children:(0,J.jsx)(h.Ay,{container:!0,direction:"row",justifyContent:"center",alignItems:"stretch",spacing:3,children:(0,J.jsx)(h.Ay,{item:!0,xs:12,children:(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(y.A,{className:"heightcard",children:(0,J.jsx)("div",{children:se?(0,J.jsx)(q.A,{title:"Loading..."}):(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(S.A,{}),Q&&Q.length>0?(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(f.A,{className:"heighttableContainer",children:(0,J.jsxs)(b.A,{stickyHeader:!0,children:[(0,J.jsx)(P.A,{children:(0,J.jsxs)(C.A,{children:[(0,J.jsx)(I.A,{children:(0,J.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Sr. No"})}),(0,J.jsx)(I.A,{align:"center",children:(0,J.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Height in cm"})}),(0,J.jsx)(I.A,{align:"right",children:(0,J.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Actions"})})]})}),(0,J.jsx)(H.A,{children:Q.map(((t,a)=>(0,J.jsxs)(C.A,{hover:!0,children:[(0,J.jsx)(I.A,{children:(0,J.jsx)(u.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,children:e*s+a+1})}),(0,J.jsx)(I.A,{align:"center",children:(0,J.jsxs)(u.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,children:[t.name," cm"]})}),(0,J.jsx)(I.A,{align:"right",children:Ce?(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(k.A,{title:0===t.isActive?"Inactive":"Active",arrow:!0,children:(0,J.jsx)(R.A,{disabled:"demo@admin.com"===(null===ve||void 0===ve?void 0:ve.email),checked:0!==t.isActive,onClick:e=>(async(e,t)=>{oe({id:e,status:t}),he(!0)})(t.id,t.isActive),inputProps:{"aria-label":"controlled"}})}),(0,J.jsx)(k.A,{title:"Edit ",arrow:!0,children:(0,J.jsx)(l.A,{disabled:"demo@admin.com"===(null===ve||void 0===ve?void 0:ve.email),sx:{"&:hover":{background:We.colors.error.lighter},color:We.palette.primary.main},color:"inherit",size:"small",onClick:e=>{return s=t.id,a=t.name,oe({id:s,name:a}),re(!1),de(""),me(!1),pe(""),void te(!0);var s,a},children:(0,J.jsx)(M.A,{fontSize:"small"})})})]}):(0,J.jsx)(J.Fragment,{})})]},t.id)))})]})}),(0,J.jsx)(c.A,{p:2,children:(0,J.jsx)(T.A,{component:"div",count:F,onPageChange:(e,a)=>{t(a),ze(a*s,s)},onRowsPerPageChange:e=>{o(parseInt(e.target.value)),t(0),ze(0,parseInt(e.target.value))},page:e,rowsPerPage:s,rowsPerPageOptions:[10,20,30,40]})})]}):(0,J.jsx)(O.A,{sx:{display:"flex",justifyContent:"center",alignItems:"center",textAlign:"center",verticalAlign:"middle",boxShadow:"none"},className:"heightcard",children:(0,J.jsx)(u.A,{variant:"h5",paragraph:!0,children:"Data not Found"})})]})})}),(0,J.jsx)("div",{children:(0,J.jsxs)(n.A,{open:ce,onClose:Ne,fullWidth:!0,maxWidth:"xs",children:[(0,J.jsx)(r.A,{sx:{m:0,p:2,fontSize:"20px",fontWeight:"bolder"},children:0===ie.status?"Inactive":"Active"}),(0,J.jsx)(w.A,{children:(0,J.jsx)(N.A,{style:{fontSize:"1rem",letterSpacing:"0.00938em"},children:0===ie.status?"Are you sure you want to Active?":"Are you sure you want to Inactive?"})}),(0,J.jsxs)(z.A,{children:[(0,J.jsx)(p.A,{onClick:Ne,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,J.jsx)(p.A,{disabled:"demo@admin.com"===(null===ve||void 0===ve?void 0:ve.email),onClick:async()=>{const t=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={id:ie.id};await E.A.httpPost("/api/admin/height/activeInactiveHeight",i,t,a);he(!1),ze(e*s,s)},variant:"outlined",style:{marginRight:"10px"},children:"Yes"})]})]})}),(0,J.jsx)("div",{children:(0,J.jsxs)(V,{open:ee,onClose:Oe,PaperProps:{sx:{height:"40%"}},fullWidth:!0,maxWidth:"xs",children:[(0,J.jsx)(Y,{id:"customized-dialog-title",onClose:Oe,children:ie.id?"Edit Height":"Add Height"}),(0,J.jsxs)(w.A,{dividers:!0,children:[(0,J.jsx)(A.A,{autoFocus:!0,margin:"dense",id:"name",label:"Height in cm",type:"text",fullWidth:!0,variant:"outlined",name:"name",value:ie.name,onChange:e=>{(e=>{const{name:t,value:s}=e.target;oe({...ie,[t]:s}),te(!0),me(!1),pe("")})(e),(e=>{const{name:t,value:s}=e.target;s?Te.test(e.target.value)?(re(!1),de("")):(re(!0),de("Please enter a number consisting of one to three digits.")):(re(!0),de("Height is required"))})(e)},required:!0}),(0,J.jsx)(W.A,{style:{color:"red",height:"22px"},children:ne&&le})]}),(0,J.jsxs)(c.A,{sx:{display:"flex",justifyContent:"space-between",p:"8px"},children:[(0,J.jsx)(W.A,{style:{color:"red",height:"22px",margin:"none",padding:"8px 0px"},children:ge&&ue}),(0,J.jsxs)(u.A,{children:[(0,J.jsx)(p.A,{disabled:"demo@admin.com"===(null===ve||void 0===ve?void 0:ve.email),onClick:Oe,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,J.jsx)(p.A,{disabled:"demo@admin.com"===(null===ve||void 0===ve?void 0:ve.email),onClick:async a=>{var i=(e=>{e.preventDefault();var t=!0;return ie.name?Te.test(ie.name)?(re(!1),de(""),t=!0):(re(!0),de("Please enter a number consisting of one to three digits."),t=!1):(re(!0),de("Height is required"),t=!1),t})(a);if(i)try{if(ie.id){const t=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={id:ie.id,name:ie.name};const o=await E.A.httpPost("/api/admin/height/insertUpdateHeight",i,t,a);o&&200==o.status?(ze(e*s,s),te(!1)):401==o.status?(localStorage.clear(),je("/admin")):400==o.status?(te(!1),$.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT})):203==o.status?(me(!0),pe("Height already exists!")):(500==o.status||300==o.status||404==o.status)&&(te(!1),$.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT}))}else{const e=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken"),i=await E.A.httpPost("/api/admin/height/insertUpdateHeight",ie,e,a);i&&200==i.status?(t(0),te(!1),ze(0,s)):401==i.status?(localStorage.clear(),je("/admin")):400==i.status?(te(!1),$.oR.error(i.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT})):203==i.status?(me(!0),pe("Height already exists!")):(500==i.status||300==i.status||404==i.status)&&(te(!1),$.oR.error(i.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT}))}}catch(o){te(!1),$.oR.error(o,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:$.oR.POSITION.TOP_RIGHT}),ae(!1)}},variant:"outlined",style:{marginRight:"10px"},children:"Save"})]})]})]})})]})})})})]})}},39155:(e,t,s)=>{var a=s(24994);t.A=void 0;var i=a(s(40039)),o=s(70579),n=(0,i.default)((0,o.jsx)("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"AddTwoTone");t.A=n},66360:(e,t,s)=>{var a=s(24994);t.A=void 0;var i=a(s(40039)),o=s(70579),n=(0,i.default)((0,o.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"Search");t.A=n},84882:(e,t,s)=>{s.d(t,{A:()=>v});var a=s(58168),i=s(98587),o=s(65043),n=s(69292),r=s(98610),l=s(21573),d=s(98206),c=s(34535),h=s(92532),g=s(72372);function m(e){return(0,g.Ay)("MuiTableHead",e)}(0,h.A)("MuiTableHead",["root"]);var u=s(70579);const p=["className","component"],x=(0,c.Ay)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"table-header-group"}),A={variant:"head"},j="thead",v=o.forwardRef((function(e,t){const s=(0,d.b)({props:e,name:"MuiTableHead"}),{className:o,component:c=j}=s,h=(0,i.A)(s,p),g=(0,a.A)({},s,{component:c}),v=(e=>{const{classes:t}=e;return(0,r.A)({root:["root"]},m,t)})(g);return(0,u.jsx)(l.A.Provider,{value:A,children:(0,u.jsx)(x,(0,a.A)({as:c,className:(0,n.A)(v.root,o),ref:t,role:c===j?null:"rowgroup",ownerState:g},h))})}))},71806:(e,t,s)=>{s.d(t,{A:()=>j});var a=s(98587),i=s(58168),o=s(65043),n=s(69292),r=s(98610),l=s(41009),d=s(98206),c=s(34535),h=s(92532),g=s(72372);function m(e){return(0,g.Ay)("MuiTable",e)}(0,h.A)("MuiTable",["root","stickyHeader"]);var u=s(70579);const p=["className","component","padding","size","stickyHeader"],x=(0,c.Ay)("table",{name:"MuiTable",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:s}=e;return[t.root,s.stickyHeader&&t.stickyHeader]}})((e=>{let{theme:t,ownerState:s}=e;return(0,i.A)({display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":(0,i.A)({},t.typography.body2,{padding:t.spacing(2),color:(t.vars||t).palette.text.secondary,textAlign:"left",captionSide:"bottom"})},s.stickyHeader&&{borderCollapse:"separate"})})),A="table",j=o.forwardRef((function(e,t){const s=(0,d.b)({props:e,name:"MuiTable"}),{className:c,component:h=A,padding:g="normal",size:j="medium",stickyHeader:v=!1}=s,y=(0,a.A)(s,p),S=(0,i.A)({},s,{component:h,padding:g,size:j,stickyHeader:v}),f=(e=>{const{classes:t,stickyHeader:s}=e,a={root:["root",s&&"stickyHeader"]};return(0,r.A)(a,m,t)})(S),b=o.useMemo((()=>({padding:g,size:j,stickyHeader:v})),[g,j,v]);return(0,u.jsx)(l.A.Provider,{value:b,children:(0,u.jsx)(x,(0,i.A)({as:h,role:h===A?null:"table",ref:t,className:(0,n.A)(f.root,c),ownerState:S},y))})}))},8740:()=>{}}]);
//# sourceMappingURL=6905.c8d86793.chunk.js.map