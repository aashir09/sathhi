"use strict";(self.webpackChunkmatrimony=self.webpackChunkmatrimony||[]).push([[5675],{24146:(e,t,s)=>{s.d(t,{A:()=>l});var a=s(34535),i=s(96446),o=s(19252),r=s(70579);const n=(0,a.Ay)(i.A)((e=>{let{theme:t}=e;return`\n        padding: ${t.spacing(1)};\n`})),l=e=>{let{children:t}=e;return(0,r.jsx)(n,{className:"MuiPageTitle-wrapper",children:(0,r.jsx)(o.A,{maxWidth:"lg",children:t})})}},94786:(e,t,s)=>{s.d(t,{A:()=>i});s(65043);var a=s(70579);const i=e=>{const{title:t}=e;return(0,a.jsx)("div",{className:"spinner-container",children:(0,a.jsx)("div",{className:"loading-spinner"})})}},5675:(e,t,s)=>{s.r(t),s.d(t,{default:()=>K});var a=s(66360),i=s(29490),o=s(24146),r=s(34535),n=s(83462),l=s(26600),d=s(17392),c=s(26240),m=s(96446),h=s(68903),g=s(88911),p=s(22698),u=s(85865),x=s(11906),A=s(53193),j=s(67784),v=s(51787),y=s(19252),S=s(12110),b=s(39336),f=s(79650),P=s(71806),C=s(84882),I=s(28076),k=s(10039),R=s(73460),T=s(69392),O=s(4598),w=s(92598),H=s(63336),N=s(35316),z=s(98533),W=s(29347),D=s(81673),M=s(33639),B=s(26688),F=s(39155),_=s(74802),G=s(65043),L=s(73216),E=s(35475),q=s(11633),U=s(94786),Z=s(47503),$=(s(92342),s(8740),s(70579));const J=(0,r.Ay)(n.A)((e=>{let{theme:t}=e;return{"& .MuiDialogContent-root":{padding:t.spacing(2)},"& .MuiDialogActions-root":{padding:t.spacing(1)},"& .MuiPaper-root":{height:"260px"}}}));function V(e){const{children:t,onClose:s,...a}=e;return(0,$.jsxs)(l.A,{sx:{m:0,p:2,fontSize:"18px",fontWeight:"bold"},...a,children:[t,s?(0,$.jsx)(d.A,{"aria-label":"close",onClick:s,sx:{position:"absolute",right:13,top:13,color:e=>e.palette.grey[500]},children:(0,$.jsx)(_.A,{})}):null]})}const Y={id:0,name:""};const K=function(){const[e,t]=(0,G.useState)(0),[s,r]=(0,G.useState)(10),[_,K]=(0,G.useState)(10),[Q,X]=G.useState([]),[ee,te]=G.useState(!1),[se,ae]=(0,G.useState)(!1),[ie,oe]=G.useState(Y),[re,ne]=(0,G.useState)(!1),[le,de]=(0,G.useState)(""),[ce,me]=(0,G.useState)(!1),[he,ge]=(0,G.useState)(!1),[pe,ue]=(0,G.useState)(""),[xe,Ae]=(0,G.useState)(!1);let[je,ve]=(0,G.useState)("");const ye=(0,L.Zp)();let[Se,be]=(0,G.useState)();const[fe,Pe]=(0,G.useState)(!0),[Ce,Ie]=(0,G.useState)(!0),[ke,Re]=(0,G.useState)(!0),[Te,Oe]=(0,G.useState)(!0);G.useEffect((()=>{let e=JSON.parse(localStorage.getItem("Credentials"));if(be(e),e)if(1!=e.roleId){let t=e.pagePermissions.findIndex((e=>"Block Users"===e.title));t>=0&&(Pe(e.pagePermissions[t].isReadPermission),Ie(e.pagePermissions[t].isAddPermission),Re(e.pagePermissions[t].isEditPermission),Oe(e.pagePermissions[t].isDeletePermission),e.pagePermissions[t].isReadPermission&&we())}else we()}),[]);const we=async()=>{De(e,s),te(!1)},He=new RegExp(/^[a-zA-Z_ ]+$/),Ne=()=>{te(!1)},ze=async()=>{oe(Y),ne(!1),de(""),ge(!1),ue(""),te(!0)},We=()=>{me(!1)},De=async(e,t)=>{try{if(je){const s=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={startIndex:e,fetchRecord:t,name:je||""};const o=await q.A.httpPost("/api/admin/diet/getDiet",i,s,a);X(o.recordList),K(o.totalRecords)}else{ae(!0);const s=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={startIndex:e,fetchRecord:t};const o=await q.A.httpPost("/api/admin/diet/getDiet",i,s,a);X(o.recordList),K(o.totalRecords),o&&200==o.status?te(!1):401==o.status?(localStorage.clear(),ye("/admin")):(500==o.status||400==o.status||300==o.status||404==o.status)&&(te(!1),Z.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT})),ae(!1)}}catch(s){te(!1),Z.oR.error(s,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT}),ae(!1)}},Me=(0,c.A)();return(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(Z.N9,{style:{top:"10%",left:"80%"},autoClose:6e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0}),(0,$.jsx)(i.mg,{children:(0,$.jsx)("title",{children:"Diet"})}),(0,$.jsx)(o.A,{children:(0,$.jsx)(m.A,{p:1,children:(0,$.jsxs)(h.Ay,{container:!0,justifyContent:"space-between",alignItems:"center",children:[(0,$.jsx)(h.Ay,{item:!0,children:(0,$.jsx)(g.A,{alignItems:"left",justifyContent:"space-between",children:(0,$.jsxs)(p.A,{"aria-label":"breadcrumb",children:[(0,$.jsx)(E.N_,{to:"/admin",style:{display:"flex",color:"black"},children:(0,$.jsx)(M.A,{})}),(0,$.jsx)(u.A,{variant:"subtitle2",color:"inherit",fontWeight:"bold",children:"Diet"})]})})}),(0,$.jsx)(h.Ay,{item:!0,children:(0,$.jsxs)(h.Ay,{container:!0,spacing:1.5,children:[(0,$.jsx)(h.Ay,{item:!0,children:Ce?(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(x.A,{className:"buttonLarge",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:ze,size:"small",children:[(0,$.jsx)(F.A,{fontSize:"small"})," Create Diet"]}),(0,$.jsx)(x.A,{className:"button",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:ze,size:"small",children:(0,$.jsx)(F.A,{fontSize:"small"})})]}):(0,$.jsx)($.Fragment,{})}),(0,$.jsx)(h.Ay,{item:!0,children:(0,$.jsx)(A.A,{sx:{mt:{xs:.3,md:.3,lg:.3,sm:.3}},children:(0,$.jsx)(j.A,{name:"searchString",value:je,onChange:t=>(t=>{ve(t.target.value),je=t.target.value,De(e,s)})(t),id:"outlined-basic",label:"Search",variant:"outlined",size:"small",InputProps:{startAdornment:(0,$.jsx)(v.A,{position:"start",children:(0,$.jsx)(a.A,{})})}})})})]})})]})})}),(0,$.jsx)(y.A,{maxWidth:"lg",children:(0,$.jsx)(h.Ay,{container:!0,direction:"row",justifyContent:"center",alignItems:"stretch",spacing:3,children:(0,$.jsx)(h.Ay,{item:!0,xs:12,children:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(S.A,{className:"dietcard",children:(0,$.jsx)("div",{children:se?(0,$.jsx)(U.A,{title:"Loading..."}):(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(b.A,{}),Q&&Q.length>0?(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(f.A,{className:"diettableContainer",children:(0,$.jsxs)(P.A,{stickyHeader:!0,children:[(0,$.jsx)(C.A,{children:(0,$.jsxs)(I.A,{children:[(0,$.jsx)(k.A,{children:(0,$.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Sr. NO"})}),(0,$.jsx)(k.A,{align:"center",children:(0,$.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Food Habit"})}),(0,$.jsx)(k.A,{align:"right",children:(0,$.jsx)(u.A,{noWrap:!0,style:{fontSize:"13px",fontWeight:"bold",marginBottom:"none"},children:"Actions"})})]})}),(0,$.jsx)(R.A,{children:Q.map(((t,a)=>(0,$.jsxs)(I.A,{hover:!0,children:[(0,$.jsx)(k.A,{children:(0,$.jsx)(u.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,children:e*s+a+1})}),(0,$.jsx)(k.A,{align:"center",children:(0,$.jsx)(u.A,{variant:"body1",fontWeight:"bold",color:"text.primary",gutterBottom:!0,noWrap:!0,sx:{textTransform:"capitalize"},children:t.name})}),(0,$.jsx)(k.A,{align:"right",children:ke?(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(T.A,{title:0===t.isActive?"Inactive":"Active",arrow:!0,children:(0,$.jsx)(O.A,{disabled:"demo@admin.com"===(null===Se||void 0===Se?void 0:Se.email),checked:0!==t.isActive,onClick:e=>(async(e,t)=>{oe({id:e,status:t}),me(!0)})(t.id,t.isActive),inputProps:{"aria-label":"controlled"}})}),(0,$.jsx)(T.A,{title:"Edit ",arrow:!0,children:(0,$.jsx)(d.A,{disabled:"demo@admin.com"===(null===Se||void 0===Se?void 0:Se.email),sx:{"&:hover":{background:Me.colors.error.lighter},color:Me.palette.primary.main},color:"inherit",size:"small",onClick:e=>{return s=t.id,a=t.name,oe({id:s,name:a}),ne(!1),de(""),ge(!1),ue(""),void te(!0);var s,a},children:(0,$.jsx)(B.A,{fontSize:"small"})})})]}):(0,$.jsx)($.Fragment,{})})]},t.id)))})]})}),(0,$.jsx)(m.A,{p:2,children:(0,$.jsx)(w.A,{component:"div",count:_,onPageChange:(e,a)=>{t(a),De(a*s,s)},onRowsPerPageChange:e=>{r(parseInt(e.target.value)),t(0),De(0,parseInt(e.target.value))},page:e,rowsPerPage:s,rowsPerPageOptions:[10,20,30,40]})})]}):(0,$.jsx)(H.A,{sx:{display:"flex",justifyContent:"center",alignItems:"center",textAlign:"center",verticalAlign:"middle",boxShadow:"none"},className:"dietcard",children:(0,$.jsx)(u.A,{variant:"h5",paragraph:!0,children:"Data not Found"})})]})})}),(0,$.jsx)("div",{children:(0,$.jsxs)(n.A,{open:ce,onClose:We,fullWidth:!0,maxWidth:"xs",children:[(0,$.jsx)(l.A,{sx:{m:0,p:2,fontSize:"20px",fontWeight:"bolder"},children:0===ie.status?"Inactive":"Active"}),(0,$.jsx)(N.A,{children:(0,$.jsx)(z.A,{style:{fontSize:"1rem",letterSpacing:"0.00938em"},children:0===ie.status?"Are you sure you want to Active?":"Are you sure you want to Inactive?"})}),(0,$.jsxs)(W.A,{children:[(0,$.jsx)(x.A,{onClick:We,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,$.jsx)(x.A,{disabled:"demo@admin.com"===(null===Se||void 0===Se?void 0:Se.email),onClick:async()=>{const t=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={id:ie.id};await q.A.httpPost("/api/admin/diet/activeInactiveDiet",i,t,a);me(!1),De(e*s,s)},variant:"outlined",style:{marginRight:"10px"},children:"Yes"})]})]})}),(0,$.jsx)("div",{children:(0,$.jsxs)(J,{open:ee,onClose:Ne,PaperProps:{sx:{height:"40%"}},fullWidth:!0,maxWidth:"xs",children:[(0,$.jsx)(V,{id:"customized-dialog-title",onClose:Ne,children:ie.id?"Edit Diet":"Add Diet"}),(0,$.jsxs)(N.A,{dividers:!0,children:[(0,$.jsx)(j.A,{autoFocus:!0,margin:"dense",id:"name",label:"FoodHabit",type:"text",fullWidth:!0,variant:"outlined",name:"name",value:ie.name,onChange:e=>{(e=>{const{name:t,value:s}=e.target;oe({...ie,[t]:s}),te(!0),ge(!1),ue("")})(e),(e=>{const{value:t}=e.target;t?He.test(e.target.value)?(ne(!1),de("")):(ne(!0),de("Alphabet and space allowed")):(ne(!0),de("Diet is required"))})(e)},required:!0}),(0,$.jsx)(D.A,{style:{color:"red",height:"22px"},children:re&&le})]}),(0,$.jsxs)(m.A,{sx:{display:"flex",justifyContent:"space-between",p:"8px"},children:[(0,$.jsx)(D.A,{style:{color:"red",height:"22px",margin:"none",padding:"8px 0px"},children:he&&pe}),(0,$.jsxs)(u.A,{children:[(0,$.jsx)(x.A,{disabled:"demo@admin.com"===(null===Se||void 0===Se?void 0:Se.email),onClick:Ne,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,$.jsx)(x.A,{disabled:"demo@admin.com"===(null===Se||void 0===Se?void 0:Se.email),onClick:async a=>{var i=(e=>{e.preventDefault();var t=!0;return ie.name?He.test(ie.name)?(ne(!1),de(""),t=!0):(ne(!0),de("Alphabet and space allowed"),t=!1):(ne(!0),de("Diet is required"),t=!1),t})(a);if(i)try{if(ie.id){const t=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let i={id:ie.id,name:ie.name};const o=await q.A.httpPost("/api/admin/diet/insertUpdateDiet",i,t,a);o&&200==o.status?(De(e*s,s),te(!1)):401==o.status?(localStorage.clear(),ye("/admin")):400==o.status?(te(!1),Z.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT})):203==o.status?(ge(!0),ue("Diet already exists!")):(500==o.status||300==o.status||404==o.status)&&(te(!1),Z.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT}))}else{const e=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken"),i=await q.A.httpPost("/api/admin/diet/insertUpdateDiet",ie,e,a);i&&200==i.status?(t(0),te(!1),De(0,s)):401==i.status?(localStorage.clear(),ye("/admin")):400==i.status?(te(!1),Z.oR.error(i.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT})):203==i.status?(ge(!0),ue("Diet already exists!")):(500==i.status||300==i.status||404==i.status)&&(te(!1),Z.oR.error(i.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT}))}}catch(o){te(!1),Z.oR.error(o,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:Z.oR.POSITION.TOP_RIGHT}),ae(!1)}},variant:"outlined",style:{marginRight:"10px"},children:"Save"})]})]})]})})]})})})})]})}},39155:(e,t,s)=>{var a=s(24994);t.A=void 0;var i=a(s(40039)),o=s(70579),r=(0,i.default)((0,o.jsx)("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"AddTwoTone");t.A=r},66360:(e,t,s)=>{var a=s(24994);t.A=void 0;var i=a(s(40039)),o=s(70579),r=(0,i.default)((0,o.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"Search");t.A=r},84882:(e,t,s)=>{s.d(t,{A:()=>v});var a=s(58168),i=s(98587),o=s(65043),r=s(69292),n=s(98610),l=s(21573),d=s(98206),c=s(34535),m=s(92532),h=s(72372);function g(e){return(0,h.Ay)("MuiTableHead",e)}(0,m.A)("MuiTableHead",["root"]);var p=s(70579);const u=["className","component"],x=(0,c.Ay)("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"table-header-group"}),A={variant:"head"},j="thead",v=o.forwardRef((function(e,t){const s=(0,d.b)({props:e,name:"MuiTableHead"}),{className:o,component:c=j}=s,m=(0,i.A)(s,u),h=(0,a.A)({},s,{component:c}),v=(e=>{const{classes:t}=e;return(0,n.A)({root:["root"]},g,t)})(h);return(0,p.jsx)(l.A.Provider,{value:A,children:(0,p.jsx)(x,(0,a.A)({as:c,className:(0,r.A)(v.root,o),ref:t,role:c===j?null:"rowgroup",ownerState:h},m))})}))},71806:(e,t,s)=>{s.d(t,{A:()=>j});var a=s(98587),i=s(58168),o=s(65043),r=s(69292),n=s(98610),l=s(41009),d=s(98206),c=s(34535),m=s(92532),h=s(72372);function g(e){return(0,h.Ay)("MuiTable",e)}(0,m.A)("MuiTable",["root","stickyHeader"]);var p=s(70579);const u=["className","component","padding","size","stickyHeader"],x=(0,c.Ay)("table",{name:"MuiTable",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:s}=e;return[t.root,s.stickyHeader&&t.stickyHeader]}})((e=>{let{theme:t,ownerState:s}=e;return(0,i.A)({display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":(0,i.A)({},t.typography.body2,{padding:t.spacing(2),color:(t.vars||t).palette.text.secondary,textAlign:"left",captionSide:"bottom"})},s.stickyHeader&&{borderCollapse:"separate"})})),A="table",j=o.forwardRef((function(e,t){const s=(0,d.b)({props:e,name:"MuiTable"}),{className:c,component:m=A,padding:h="normal",size:j="medium",stickyHeader:v=!1}=s,y=(0,a.A)(s,u),S=(0,i.A)({},s,{component:m,padding:h,size:j,stickyHeader:v}),b=(e=>{const{classes:t,stickyHeader:s}=e,a={root:["root",s&&"stickyHeader"]};return(0,n.A)(a,g,t)})(S),f=o.useMemo((()=>({padding:h,size:j,stickyHeader:v})),[h,j,v]);return(0,p.jsx)(l.A.Provider,{value:f,children:(0,p.jsx)(x,(0,i.A)({as:m,role:m===A?null:"table",ref:t,className:(0,r.A)(b.root,c),ownerState:S},y))})}))},8740:()=>{}}]);
//# sourceMappingURL=5675.6c4bae1a.chunk.js.map