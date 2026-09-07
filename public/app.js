const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
function isCountry(v){return COUNTRIES.some(c=>c.toLowerCase()===String(v||'').trim().toLowerCase());}
const COUNTRY_CODES = {"Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Andorra":"AD","Angola":"AO","Antigua and Barbuda":"AG","Argentina":"AR","Armenia":"AM","Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahamas":"BS","Bahrain":"BH","Bangladesh":"BD","Barbados":"BB","Belarus":"BY","Belgium":"BE","Belize":"BZ","Benin":"BJ","Bhutan":"BT","Bolivia":"BO","Bosnia and Herzegovina":"BA","Botswana":"BW","Brazil":"BR","Brunei":"BN","Bulgaria":"BG","Burkina Faso":"BF","Burundi":"BI","Cabo Verde":"CV","Cambodia":"KH","Cameroon":"CM","Canada":"CA","Central African Republic":"CF","Chad":"TD","Chile":"CL","China":"CN","Colombia":"CO","Comoros":"KM","Costa Rica":"CR","Croatia":"HR","Cuba":"CU","Cyprus":"CY","Czechia":"CZ","Democratic Republic of the Congo":"CD","Denmark":"DK","Djibouti":"DJ","Dominica":"DM","Dominican Republic":"DO","Ecuador":"EC","Egypt":"EG","El Salvador":"SV","Equatorial Guinea":"GQ","Eritrea":"ER","Estonia":"EE","Eswatini":"SZ","Ethiopia":"ET","Fiji":"FJ","Finland":"FI","France":"FR","Gabon":"GA","Gambia":"GM","Georgia":"GE","Germany":"DE","Ghana":"GH","Greece":"GR","Grenada":"GD","Guatemala":"GT","Guinea":"GN","Guinea-Bissau":"GW","Guyana":"GY","Haiti":"HT","Honduras":"HN","Hungary":"HU","Iceland":"IS","India":"IN","Indonesia":"ID","Iran":"IR","Iraq":"IQ","Ireland":"IE","Israel":"IL","Italy":"IT","Ivory Coast":"CI","Jamaica":"JM","Japan":"JP","Jordan":"JO","Kazakhstan":"KZ","Kenya":"KE","Kiribati":"KI","Kuwait":"KW","Kyrgyzstan":"KG","Laos":"LA","Latvia":"LV","Lebanon":"LB","Lesotho":"LS","Liberia":"LR","Libya":"LY","Liechtenstein":"LI","Lithuania":"LT","Luxembourg":"LU","Madagascar":"MG","Malawi":"MW","Malaysia":"MY","Maldives":"MV","Mali":"ML","Malta":"MT","Marshall Islands":"MH","Mauritania":"MR","Mauritius":"MU","Mexico":"MX","Micronesia":"FM","Moldova":"MD","Monaco":"MC","Mongolia":"MN","Montenegro":"ME","Morocco":"MA","Mozambique":"MZ","Myanmar":"MM","Namibia":"NA","Nauru":"NR","Nepal":"NP","Netherlands":"NL","New Zealand":"NZ","Nicaragua":"NI","Niger":"NE","Nigeria":"NG","North Korea":"KP","North Macedonia":"MK","Norway":"NO","Oman":"OM","Pakistan":"PK","Palau":"PW","Panama":"PA","Papua New Guinea":"PG","Paraguay":"PY","Peru":"PE","Philippines":"PH","Poland":"PL","Portugal":"PT","Qatar":"QA","Republic of the Congo":"CG","Romania":"RO","Russia":"RU","Rwanda":"RW","Saint Kitts and Nevis":"KN","Saint Lucia":"LC","Saint Vincent and the Grenadines":"VC","Samoa":"WS","San Marino":"SM","Sao Tome and Principe":"ST","Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Seychelles":"SC","Sierra Leone":"SL","Singapore":"SG","Slovakia":"SK","Slovenia":"SI","Solomon Islands":"SB","Somalia":"SO","South Africa":"ZA","South Korea":"KR","South Sudan":"SS","Spain":"ES","Sri Lanka":"LK","Sudan":"SD","Suriname":"SR","Sweden":"SE","Switzerland":"CH","Syria":"SY","Taiwan":"TW","Tajikistan":"TJ","Tanzania":"TZ","Thailand":"TH","Timor-Leste":"TL","Togo":"TG","Tonga":"TO","Trinidad and Tobago":"TT","Tunisia":"TN","Turkmenistan":"TM","Tuvalu":"TV","Uganda":"UG","Ukraine":"UA","United Arab Emirates":"AE","United Kingdom":"GB","United States":"US","Uruguay":"UY","Uzbekistan":"UZ","Vanuatu":"VU","Vatican City":"VA","Venezuela":"VE","Vietnam":"VN","Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW"};
function initCountries(){const dl=$('#countryList');if(!dl)return;let dn=null;try{dn=new Intl.DisplayNames([uiLang()],{type:'region'});}catch{}dl.innerHTML=COUNTRIES.map(c=>{const localized=dn&&COUNTRY_CODES[c]?dn.of(COUNTRY_CODES[c]):c;return `<option value="${escapeHtml(c)}" label="${escapeHtml(localized===c?'':localized)}"></option>`;}).join('');}



const UI_LANGS = ['en','vi','es','fr','de','pt','it','nl','pl','tr','ru','uk','ar','fa','hi','bn','ur','zh','ja','ko','th','fil','id','ms','sw'];
const UI_TRANSLATIONS = {
vi:{'Discover':'Khám phá','Matches':'Tương hợp','Messages':'Tin nhắn','Profile':'Hồ sơ','Settings':'Cài đặt','Sign in':'Đăng nhập','Join VOWSI':'Tham gia VOWSI','Log out':'Đăng xuất','Create free account':'Tạo tài khoản miễn phí','I already have an account':'Tôi đã có tài khoản','Create your account':'Tạo tài khoản','Start simple. You can build your profile right after joining.':'Bắt đầu thật đơn giản. Bạn có thể hoàn thiện hồ sơ ngay sau khi tham gia.','Display name':'Tên hiển thị','Email':'Email','Password':'Mật khẩu','Confirm password':'Xác nhận mật khẩu','Date of birth':'Ngày sinh','Country':'Quốc gia','Create account':'Tạo tài khoản','Gender':'Giới tính','Looking for':'Muốn tìm','City':'Thành phố','Occupation':'Nghề nghiệp','Choose':'Chọn','Woman':'Nữ','Man':'Nam','Everyone':'Mọi người','Women':'Nữ','Men':'Nam','Back':'Quay lại','Continue':'Tiếp tục','Finish profile':'Hoàn tất hồ sơ','Relationship goal':'Mục tiêu mối quan hệ','Serious relationship':'Mối quan hệ nghiêm túc','Marriage':'Hôn nhân','Long-term dating':'Hẹn hò lâu dài','See where it goes':'Tìm hiểu xem sẽ đi đến đâu','Languages':'Ngôn ngữ','Interests':'Sở thích','About you':'Giới thiệu về bạn','Add photo':'Thêm ảnh','+ Add photos':'+ Thêm ảnh','Meet with intention.':'Gặp gỡ với mục đích rõ ràng.','Any country':'Mọi quốc gia','Min age':'Tuổi tối thiểu','Max age':'Tuổi tối đa','Any goal':'Mọi mục tiêu','Apply filters':'Áp dụng bộ lọc','Reset filters':'Đặt lại bộ lọc','No more profiles right now':'Hiện chưa còn hồ sơ phù hợp','People who chose you back.':'Những người cũng chọn bạn.','No matches yet':'Chưa có tương hợp','Discover people':'Khám phá mọi người','Your conversations':'Cuộc trò chuyện của bạn','Select a match':'Chọn một người tương hợp','Write a message…':'Viết tin nhắn…','Send':'Gửi','Safety':'An toàn','Unmatch':'Hủy tương hợp','Show who you really are.':'Hãy thể hiện con người thật của bạn.','Save profile':'Lưu hồ sơ','Change password':'Đổi mật khẩu','Current password':'Mật khẩu hiện tại','New password':'Mật khẩu mới','Update':'Cập nhật','Show me in Discover':'Hiển thị tôi trong Khám phá','Delete account':'Xóa tài khoản','Report':'Báo cáo','Block':'Chặn','Reason':'Lý do','Choose a reason':'Chọn lý do','Fake profile or scam':'Hồ sơ giả hoặc lừa đảo','Harassment or abusive behavior':'Quấy rối hoặc hành vi lạm dụng','Inappropriate content':'Nội dung không phù hợp','Spam or solicitation':'Spam hoặc chào mời','Impersonation':'Mạo danh','Underage concern':'Nghi ngờ chưa đủ tuổi','Other safety concern':'Vấn đề an toàn khác','IT\'S A MATCH':'HAI BẠN ĐÃ TƯƠNG HỢP','You both chose each other.':'Hai bạn đã chọn nhau.','Send a message':'Gửi tin nhắn','Keep discovering':'Tiếp tục khám phá','Your profile is ready':'Hồ sơ của bạn đã sẵn sàng','Taking you to Discover…':'Đang đưa bạn đến Khám phá…','No conversations yet.':'Chưa có cuộc trò chuyện.','Choose a conversation to start chatting.':'Chọn một cuộc trò chuyện để bắt đầu nhắn tin.','Terms':'Điều khoản','Community Guidelines':'Nguyên tắc cộng đồng','Privacy':'Quyền riêng tư'},
es:{'Discover':'Descubrir','Matches':'Matches','Messages':'Mensajes','Profile':'Perfil','Settings':'Ajustes','Sign in':'Iniciar sesión','Join VOWSI':'Únete a VOWSI','Log out':'Cerrar sesión','Create free account':'Crear cuenta gratis','I already have an account':'Ya tengo una cuenta','Create your account':'Crea tu cuenta','Display name':'Nombre visible','Password':'Contraseña','Confirm password':'Confirmar contraseña','Date of birth':'Fecha de nacimiento','Country':'País','Create account':'Crear cuenta','Gender':'Género','Looking for':'Busco','City':'Ciudad','Occupation':'Ocupación','Choose':'Elegir','Woman':'Mujer','Man':'Hombre','Everyone':'Todos','Women':'Mujeres','Men':'Hombres','Back':'Atrás','Continue':'Continuar','Finish profile':'Finalizar perfil','Relationship goal':'Objetivo de relación','Serious relationship':'Relación seria','Marriage':'Matrimonio','Long-term dating':'Relación a largo plazo','See where it goes':'Ver qué sucede','Languages':'Idiomas','Interests':'Intereses','About you':'Sobre ti','Meet with intention.':'Conoce con intención.','Any country':'Cualquier país','Min age':'Edad mín.','Max age':'Edad máx.','Any goal':'Cualquier objetivo','Apply filters':'Aplicar filtros','Reset filters':'Restablecer filtros','No more profiles right now':'No hay más perfiles ahora','People who chose you back.':'Personas que también te eligieron.','No matches yet':'Aún no hay matches','Discover people':'Descubrir personas','Your conversations':'Tus conversaciones','Write a message…':'Escribe un mensaje…','Send':'Enviar','Safety':'Seguridad','Unmatch':'Deshacer match','Save profile':'Guardar perfil','Change password':'Cambiar contraseña','Update':'Actualizar','Delete account':'Eliminar cuenta','Report':'Reportar','Block':'Bloquear','Reason':'Motivo','Choose a reason':'Elige un motivo','Fake profile or scam':'Perfil falso o estafa','Harassment or abusive behavior':'Acoso o conducta abusiva','Inappropriate content':'Contenido inapropiado','Spam or solicitation':'Spam o solicitudes','Impersonation':'Suplantación','Underage concern':'Posible menor de edad','Other safety concern':'Otro problema de seguridad'},
fr:{'Discover':'Découvrir','Matches':'Matchs','Messages':'Messages','Profile':'Profil','Settings':'Paramètres','Sign in':'Se connecter','Join VOWSI':'Rejoindre VOWSI','Log out':'Se déconnecter','Create free account':'Créer un compte gratuit','I already have an account':'J\'ai déjà un compte','Create your account':'Créez votre compte','Display name':'Nom affiché','Password':'Mot de passe','Confirm password':'Confirmer le mot de passe','Date of birth':'Date de naissance','Country':'Pays','Create account':'Créer un compte','Gender':'Genre','Looking for':'Je recherche','City':'Ville','Occupation':'Profession','Choose':'Choisir','Woman':'Femme','Man':'Homme','Everyone':'Tout le monde','Women':'Femmes','Men':'Hommes','Back':'Retour','Continue':'Continuer','Finish profile':'Terminer le profil','Relationship goal':'Objectif relationnel','Serious relationship':'Relation sérieuse','Marriage':'Mariage','Long-term dating':'Relation à long terme','See where it goes':'Voir où cela mène','Languages':'Langues','Interests':'Centres d’intérêt','About you':'À propos de vous','Meet with intention.':'Faites des rencontres avec intention.','Any country':'Tous les pays','Apply filters':'Appliquer les filtres','Reset filters':'Réinitialiser','No more profiles right now':'Aucun autre profil pour le moment','People who chose you back.':'Les personnes qui vous ont choisi aussi.','No matches yet':'Aucun match pour le moment','Discover people':'Découvrir des personnes','Your conversations':'Vos conversations','Write a message…':'Écrire un message…','Send':'Envoyer','Safety':'Sécurité','Unmatch':'Annuler le match','Save profile':'Enregistrer le profil','Change password':'Changer le mot de passe','Update':'Mettre à jour','Delete account':'Supprimer le compte','Report':'Signaler','Block':'Bloquer','Reason':'Raison','Choose a reason':'Choisir une raison'},
de:{'Discover':'Entdecken','Matches':'Matches','Messages':'Nachrichten','Profile':'Profil','Settings':'Einstellungen','Sign in':'Anmelden','Join VOWSI':'VOWSI beitreten','Log out':'Abmelden','Create free account':'Kostenloses Konto erstellen','I already have an account':'Ich habe bereits ein Konto','Create your account':'Konto erstellen','Display name':'Anzeigename','Password':'Passwort','Confirm password':'Passwort bestätigen','Date of birth':'Geburtsdatum','Country':'Land','Create account':'Konto erstellen','Gender':'Geschlecht','Looking for':'Suche nach','City':'Stadt','Occupation':'Beruf','Choose':'Auswählen','Woman':'Frau','Man':'Mann','Everyone':'Alle','Women':'Frauen','Men':'Männer','Back':'Zurück','Continue':'Weiter','Finish profile':'Profil abschließen','Relationship goal':'Beziehungsziel','Serious relationship':'Ernsthafte Beziehung','Marriage':'Ehe','Long-term dating':'Langfristiges Dating','Languages':'Sprachen','Interests':'Interessen','About you':'Über dich','Any country':'Beliebiges Land','Apply filters':'Filter anwenden','Reset filters':'Filter zurücksetzen','No more profiles right now':'Zurzeit keine weiteren Profile','No matches yet':'Noch keine Matches','Your conversations':'Deine Unterhaltungen','Write a message…':'Nachricht schreiben…','Send':'Senden','Safety':'Sicherheit','Unmatch':'Match aufheben','Save profile':'Profil speichern','Change password':'Passwort ändern','Update':'Aktualisieren','Delete account':'Konto löschen','Report':'Melden','Block':'Blockieren','Reason':'Grund','Choose a reason':'Grund auswählen'},
pt:{'Discover':'Descobrir','Matches':'Combinações','Messages':'Mensagens','Profile':'Perfil','Settings':'Configurações','Sign in':'Entrar','Join VOWSI':'Entrar no VOWSI','Log out':'Sair','Create free account':'Criar conta grátis','I already have an account':'Já tenho uma conta','Create your account':'Crie sua conta','Display name':'Nome de exibição','Password':'Senha','Confirm password':'Confirmar senha','Date of birth':'Data de nascimento','Country':'País','Create account':'Criar conta','Gender':'Gênero','Looking for':'Procuro','City':'Cidade','Occupation':'Profissão','Choose':'Escolher','Woman':'Mulher','Man':'Homem','Everyone':'Todos','Women':'Mulheres','Men':'Homens','Back':'Voltar','Continue':'Continuar','Finish profile':'Concluir perfil','Relationship goal':'Objetivo do relacionamento','Serious relationship':'Relacionamento sério','Marriage':'Casamento','Long-term dating':'Relacionamento de longo prazo','Languages':'Idiomas','Interests':'Interesses','About you':'Sobre você','Any country':'Qualquer país','Apply filters':'Aplicar filtros','Reset filters':'Redefinir filtros','No more profiles right now':'Não há mais perfis agora','No matches yet':'Ainda não há combinações','Your conversations':'Suas conversas','Write a message…':'Escreva uma mensagem…','Send':'Enviar','Safety':'Segurança','Unmatch':'Desfazer combinação','Save profile':'Salvar perfil','Change password':'Alterar senha','Update':'Atualizar','Delete account':'Excluir conta','Report':'Denunciar','Block':'Bloquear','Reason':'Motivo','Choose a reason':'Escolha um motivo'},
it:{'Discover':'Scopri','Matches':'Match','Messages':'Messaggi','Profile':'Profilo','Settings':'Impostazioni','Sign in':'Accedi','Join VOWSI':'Unisciti a VOWSI','Log out':'Esci','Create free account':'Crea account gratuito','I already have an account':'Ho già un account','Create your account':'Crea il tuo account','Display name':'Nome visualizzato','Password':'Password','Confirm password':'Conferma password','Date of birth':'Data di nascita','Country':'Paese','Create account':'Crea account','Gender':'Genere','Looking for':'Cerco','City':'Città','Occupation':'Occupazione','Choose':'Scegli','Woman':'Donna','Man':'Uomo','Everyone':'Tutti','Women':'Donne','Men':'Uomini','Back':'Indietro','Continue':'Continua','Finish profile':'Completa profilo','Relationship goal':'Obiettivo relazione','Serious relationship':'Relazione seria','Marriage':'Matrimonio','Long-term dating':'Relazione a lungo termine','Languages':'Lingue','Interests':'Interessi','About you':'Su di te','Any country':'Qualsiasi paese','Apply filters':'Applica filtri','Reset filters':'Reimposta filtri','No more profiles right now':'Nessun altro profilo al momento','No matches yet':'Ancora nessun match','Your conversations':'Le tue conversazioni','Write a message…':'Scrivi un messaggio…','Send':'Invia','Safety':'Sicurezza','Unmatch':'Annulla match','Save profile':'Salva profilo','Change password':'Cambia password','Update':'Aggiorna','Delete account':'Elimina account','Report':'Segnala','Block':'Blocca','Reason':'Motivo','Choose a reason':'Scegli un motivo'},
ar:{'Discover':'اكتشف','Matches':'التطابقات','Messages':'الرسائل','Profile':'الملف الشخصي','Settings':'الإعدادات','Sign in':'تسجيل الدخول','Join VOWSI':'انضم إلى VOWSI','Log out':'تسجيل الخروج','Create free account':'إنشاء حساب مجاني','I already have an account':'لدي حساب بالفعل','Create your account':'أنشئ حسابك','Display name':'الاسم الظاهر','Password':'كلمة المرور','Confirm password':'تأكيد كلمة المرور','Date of birth':'تاريخ الميلاد','Country':'الدولة','Create account':'إنشاء حساب','Gender':'الجنس','Looking for':'أبحث عن','City':'المدينة','Occupation':'المهنة','Choose':'اختر','Woman':'امرأة','Man':'رجل','Everyone':'الجميع','Women':'نساء','Men':'رجال','Back':'رجوع','Continue':'متابعة','Finish profile':'إكمال الملف','Relationship goal':'هدف العلاقة','Serious relationship':'علاقة جادة','Marriage':'زواج','Long-term dating':'تعارف طويل الأمد','Languages':'اللغات','Interests':'الاهتمامات','About you':'عنك','Any country':'أي دولة','Apply filters':'تطبيق الفلاتر','Reset filters':'إعادة ضبط الفلاتر','No more profiles right now':'لا توجد ملفات أخرى الآن','No matches yet':'لا توجد تطابقات بعد','Your conversations':'محادثاتك','Write a message…':'اكتب رسالة…','Send':'إرسال','Safety':'الأمان','Unmatch':'إلغاء التطابق','Save profile':'حفظ الملف','Change password':'تغيير كلمة المرور','Update':'تحديث','Delete account':'حذف الحساب','Report':'إبلاغ','Block':'حظر','Reason':'السبب','Choose a reason':'اختر سبباً'},
zh:{'Discover':'发现','Matches':'匹配','Messages':'消息','Profile':'个人资料','Settings':'设置','Sign in':'登录','Join VOWSI':'加入 VOWSI','Log out':'退出登录','Create free account':'免费创建账号','I already have an account':'我已有账号','Create your account':'创建账号','Display name':'显示名称','Password':'密码','Confirm password':'确认密码','Date of birth':'出生日期','Country':'国家/地区','Create account':'创建账号','Gender':'性别','Looking for':'想认识','City':'城市','Occupation':'职业','Choose':'选择','Woman':'女性','Man':'男性','Everyone':'所有人','Women':'女性','Men':'男性','Back':'返回','Continue':'继续','Finish profile':'完成资料','Relationship goal':'关系目标','Serious relationship':'认真关系','Marriage':'婚姻','Long-term dating':'长期交往','Languages':'语言','Interests':'兴趣','About you':'关于你','Any country':'任何国家','Apply filters':'应用筛选','Reset filters':'重置筛选','No more profiles right now':'暂时没有更多资料','No matches yet':'还没有匹配','Your conversations':'你的对话','Write a message…':'写消息…','Send':'发送','Safety':'安全','Unmatch':'取消匹配','Save profile':'保存资料','Change password':'修改密码','Update':'更新','Delete account':'删除账号','Report':'举报','Block':'屏蔽','Reason':'原因','Choose a reason':'选择原因'},
ja:{'Discover':'見つける','Matches':'マッチ','Messages':'メッセージ','Profile':'プロフィール','Settings':'設定','Sign in':'ログイン','Join VOWSI':'VOWSIに参加','Log out':'ログアウト','Create free account':'無料アカウント作成','I already have an account':'アカウントを持っています','Create your account':'アカウントを作成','Display name':'表示名','Password':'パスワード','Confirm password':'パスワード確認','Date of birth':'生年月日','Country':'国','Create account':'アカウント作成','Gender':'性別','Looking for':'探している相手','City':'都市','Occupation':'職業','Choose':'選択','Woman':'女性','Man':'男性','Everyone':'すべて','Women':'女性','Men':'男性','Back':'戻る','Continue':'続ける','Finish profile':'プロフィール完了','Relationship goal':'関係の目的','Serious relationship':'真剣な交際','Marriage':'結婚','Long-term dating':'長期交際','Languages':'言語','Interests':'興味','About you':'自己紹介','Any country':'すべての国','Apply filters':'フィルター適用','Reset filters':'リセット','No more profiles right now':'現在これ以上のプロフィールはありません','No matches yet':'まだマッチはありません','Your conversations':'会話','Write a message…':'メッセージを書く…','Send':'送信','Safety':'安全','Unmatch':'マッチ解除','Save profile':'プロフィール保存','Change password':'パスワード変更','Update':'更新','Delete account':'アカウント削除','Report':'報告','Block':'ブロック','Reason':'理由','Choose a reason':'理由を選択'},
ko:{'Discover':'둘러보기','Matches':'매치','Messages':'메시지','Profile':'프로필','Settings':'설정','Sign in':'로그인','Join VOWSI':'VOWSI 가입','Log out':'로그아웃','Create free account':'무료 계정 만들기','I already have an account':'이미 계정이 있어요','Create your account':'계정 만들기','Display name':'표시 이름','Password':'비밀번호','Confirm password':'비밀번호 확인','Date of birth':'생년월일','Country':'국가','Create account':'계정 만들기','Gender':'성별','Looking for':'찾는 상대','City':'도시','Occupation':'직업','Choose':'선택','Woman':'여성','Man':'남성','Everyone':'모두','Women':'여성','Men':'남성','Back':'뒤로','Continue':'계속','Finish profile':'프로필 완료','Relationship goal':'관계 목표','Serious relationship':'진지한 관계','Marriage':'결혼','Long-term dating':'장기 연애','Languages':'언어','Interests':'관심사','About you':'자기소개','Any country':'모든 국가','Apply filters':'필터 적용','Reset filters':'필터 초기화','No more profiles right now':'지금은 더 볼 프로필이 없습니다','No matches yet':'아직 매치가 없습니다','Your conversations':'대화','Write a message…':'메시지 쓰기…','Send':'보내기','Safety':'안전','Unmatch':'매치 해제','Save profile':'프로필 저장','Change password':'비밀번호 변경','Update':'업데이트','Delete account':'계정 삭제','Report':'신고','Block':'차단','Reason':'이유','Choose a reason':'이유 선택'},
hi:{'Discover':'खोजें','Matches':'मैच','Messages':'संदेश','Profile':'प्रोफ़ाइल','Settings':'सेटिंग्स','Sign in':'साइन इन','Join VOWSI':'VOWSI से जुड़ें','Log out':'लॉग आउट','Create free account':'मुफ़्त खाता बनाएँ','I already have an account':'मेरे पास पहले से खाता है','Create your account':'अपना खाता बनाएँ','Display name':'दिखने वाला नाम','Password':'पासवर्ड','Confirm password':'पासवर्ड की पुष्टि','Date of birth':'जन्म तिथि','Country':'देश','Create account':'खाता बनाएँ','Gender':'लिंग','Looking for':'किसे खोज रहे हैं','City':'शहर','Occupation':'पेशा','Choose':'चुनें','Woman':'महिला','Man':'पुरुष','Everyone':'सभी','Women':'महिलाएँ','Men':'पुरुष','Back':'वापस','Continue':'जारी रखें','Finish profile':'प्रोफ़ाइल पूरी करें','Relationship goal':'रिश्ते का लक्ष्य','Serious relationship':'गंभीर रिश्ता','Marriage':'विवाह','Long-term dating':'लंबे समय का डेटिंग','Languages':'भाषाएँ','Interests':'रुचियाँ','About you':'आपके बारे में','Any country':'कोई भी देश','Apply filters':'फ़िल्टर लागू करें','Reset filters':'फ़िल्टर रीसेट करें','No more profiles right now':'अभी और प्रोफ़ाइल नहीं हैं','No matches yet':'अभी कोई मैच नहीं','Your conversations':'आपकी बातचीत','Write a message…':'संदेश लिखें…','Send':'भेजें','Safety':'सुरक्षा','Unmatch':'मैच हटाएँ','Save profile':'प्रोफ़ाइल सहेजें','Change password':'पासवर्ड बदलें','Update':'अपडेट','Delete account':'खाता हटाएँ','Report':'रिपोर्ट','Block':'ब्लॉक','Reason':'कारण','Choose a reason':'कारण चुनें'}
 };
// Complete Vietnamese landing/onboarding copy used by the current DOM.
Object.assign(UI_TRANSLATIONS.vi, {
'GLOBAL • SERIOUS • INTENTIONAL':'TOÀN CẦU • NGHIÊM TÚC • CÓ CHỦ ĐÍCH','Find Your Person,':'Tìm Người Dành Cho Bạn,','Anywhere.':'Ở Bất Cứ Đâu.','Meet people who are ready for meaningful relationships, honest conversations and something real — wherever life takes you.':'Gặp gỡ những người sẵn sàng cho một mối quan hệ ý nghĩa, những cuộc trò chuyện chân thành và điều gì đó thật sự — dù cuộc sống đưa bạn đến đâu.','18+ only':'Chỉ dành cho người từ 18 tuổi','Mutual matches':'Chỉ tương hợp khi cả hai cùng chọn','Safety tools built in':'Tích hợp công cụ an toàn','Intent first':'Ưu tiên mục tiêu','Make relationship goals clear before the first hello.':'Làm rõ mục tiêu mối quan hệ trước lời chào đầu tiên.','Match mutually':'Tương hợp từ hai phía','Conversations open only after both people choose each other.':'Cuộc trò chuyện chỉ mở khi cả hai cùng chọn nhau.','Date with confidence':'Hẹn hò an tâm','Block, report and unmatch controls are always close by.':'Các công cụ Chặn, Báo cáo và Hủy tương hợp luôn dễ sử dụng.','WELCOME TO VOWSI':'CHÀO MỪNG ĐẾN VOWSI','PROFILE SETUP':'THIẾT LẬP HỒ SƠ','Step 1 of 3':'Bước 1/3','THE BASICS':'THÔNG TIN CƠ BẢN','Help the right people understand you.':'Giúp người phù hợp hiểu về bạn.','Your signup details are already here. Review them and add a little more.':'Thông tin đăng ký đã có sẵn. Hãy kiểm tra và bổ sung thêm một chút.','YOUR INTENT':'MỤC TIÊU CỦA BẠN','What are you hoping to find?':'Bạn đang mong muốn tìm kiếm điều gì?','Clear intentions make better matches and better conversations.':'Mục tiêu rõ ràng giúp tạo nên những tương hợp và cuộc trò chuyện tốt hơn.','Build something meaningful.':'Xây dựng một mối quan hệ ý nghĩa.','Dating with marriage in mind.':'Hẹn hò với định hướng hôn nhân.','Looking for a lasting connection.':'Tìm kiếm một sự gắn kết lâu dài.','Open, but still intentional.':'Cởi mở tìm hiểu nhưng vẫn có mục tiêu.','MAKE IT YOURS':'THỂ HIỆN CHÍNH BẠN','Add your photo & a little about you.':'Thêm ảnh và một chút giới thiệu về bạn.','One clear photo and a short bio are enough to get started.':'Một ảnh rõ nét và phần giới thiệu ngắn là đủ để bắt đầu.','Your photos':'Ảnh của bạn','Tell us a little about yourself.':'Hãy chia sẻ một chút về bản thân.','Adjust preferences without leaving the page.':'Điều chỉnh tiêu chí ngay trên trang này.','Finding people for you…':'Đang tìm người phù hợp với bạn…','Try widening your filters or come back later.':'Hãy thử mở rộng bộ lọc hoặc quay lại sau.','Open a conversation whenever you\'re ready.':'Bắt đầu trò chuyện bất cứ khi nào bạn sẵn sàng.','Your messages stay between you and your match.':'Tin nhắn chỉ được chia sẻ giữa bạn và người tương hợp.','A thoughtful profile makes better conversations easier.':'Một hồ sơ chỉn chu giúp những cuộc trò chuyện tốt đẹp bắt đầu dễ dàng hơn.','You stay in control.':'Bạn luôn là người kiểm soát.','Manage visibility, security and your account.':'Quản lý hiển thị, bảo mật và tài khoản của bạn.','Safety reminder':'Nhắc nhở an toàn','Use these tools whenever something feels wrong.':'Hãy sử dụng các công cụ này bất cứ khi nào bạn cảm thấy có điều không ổn.','Report or block':'Báo cáo hoặc chặn','Say hello while the moment is fresh.':'Hãy gửi lời chào khi khoảnh khắc còn mới mẻ.'
});
// V2.6.1: additional global languages + complete high-priority onboarding/landing copy.
Object.assign(UI_TRANSLATIONS, {
  th:{'Discover':'ค้นหา','Matches':'แมตช์','Messages':'ข้อความ','Profile':'โปรไฟล์','Settings':'การตั้งค่า','Sign in':'เข้าสู่ระบบ','Join VOWSI':'เข้าร่วม VOWSI','Log out':'ออกจากระบบ','Create free account':'สร้างบัญชีฟรี','I already have an account':'ฉันมีบัญชีแล้ว','Create your account':'สร้างบัญชีของคุณ','Start simple. You can build your profile right after joining.':'เริ่มต้นง่าย ๆ แล้วสร้างโปรไฟล์ของคุณหลังสมัคร','Display name':'ชื่อที่แสดง','Email':'อีเมล','Password':'รหัสผ่าน','Confirm password':'ยืนยันรหัสผ่าน','Date of birth':'วันเกิด','Country':'ประเทศ','Create account':'สร้างบัญชี','Gender':'เพศ','Looking for':'กำลังมองหา','City':'เมือง','Occupation':'อาชีพ','Choose':'เลือก','Woman':'ผู้หญิง','Man':'ผู้ชาย','Everyone':'ทุกคน','Women':'ผู้หญิง','Men':'ผู้ชาย','Back':'ย้อนกลับ','Continue':'ดำเนินการต่อ','Finish profile':'เสร็จสิ้นโปรไฟล์','Relationship goal':'เป้าหมายความสัมพันธ์','Serious relationship':'ความสัมพันธ์จริงจัง','Marriage':'แต่งงาน','Long-term dating':'คบหาระยะยาว','See where it goes':'ค่อย ๆ ดูกันไป','Languages':'ภาษา','Interests':'ความสนใจ','About you':'เกี่ยวกับคุณ','Meet with intention.':'พบกันอย่างมีเป้าหมาย','Any country':'ทุกประเทศ','Min age':'อายุต่ำสุด','Max age':'อายุสูงสุด','Any goal':'ทุกเป้าหมาย','Apply filters':'ใช้ตัวกรอง','Reset filters':'รีเซ็ตตัวกรอง','No more profiles right now':'ตอนนี้ยังไม่มีโปรไฟล์เพิ่มเติม','People who chose you back.':'คนที่เลือกคุณเช่นกัน','No matches yet':'ยังไม่มีแมตช์','Your conversations':'การสนทนาของคุณ','Select a match':'เลือกแมตช์','Write a message…':'เขียนข้อความ…','Send':'ส่ง','Safety':'ความปลอดภัย','Unmatch':'ยกเลิกแมตช์','Save profile':'บันทึกโปรไฟล์','Change password':'เปลี่ยนรหัสผ่าน','Current password':'รหัสผ่านปัจจุบัน','New password':'รหัสผ่านใหม่','Update':'อัปเดต','Show me in Discover':'แสดงฉันในค้นหา','Delete account':'ลบบัญชี','Report':'รายงาน','Block':'บล็อก','Reason':'เหตุผล','Choose a reason':'เลือกเหตุผล','Find Your Person,':'ค้นหาคนของคุณ','Anywhere.':'ได้ทุกที่','GLOBAL • SERIOUS • INTENTIONAL':'ทั่วโลก • จริงจัง • มีเป้าหมาย','18+ only':'สำหรับอายุ 18+','Mutual matches':'แมตช์เมื่อเลือกกันทั้งคู่','Safety tools built in':'มีเครื่องมือความปลอดภัย','Intent first':'เริ่มจากความตั้งใจ','Match mutually':'แมตช์ร่วมกัน','Date with confidence':'เดตอย่างมั่นใจ','WELCOME TO VOWSI':'ยินดีต้อนรับสู่ VOWSI','PROFILE SETUP':'ตั้งค่าโปรไฟล์','THE BASICS':'ข้อมูลพื้นฐาน','YOUR INTENT':'ความตั้งใจของคุณ','MAKE IT YOURS':'สร้างให้เป็นตัวคุณ','Your photos':'รูปภาพของคุณ','+ Add photos':'+ เพิ่มรูปภาพ','Show who you really are.':'แสดงตัวตนที่แท้จริงของคุณ','No conversations yet.':'ยังไม่มีการสนทนา','Choose a conversation to start chatting.':'เลือกการสนทนาเพื่อเริ่มแชต'},
  fil:{'Discover':'Tuklasin','Matches':'Mga Match','Messages':'Mga Mensahe','Profile':'Profile','Settings':'Mga Setting','Sign in':'Mag-sign in','Join VOWSI':'Sumali sa VOWSI','Log out':'Mag-log out','Create free account':'Gumawa ng libreng account','I already have an account':'May account na ako','Create your account':'Gawin ang iyong account','Start simple. You can build your profile right after joining.':'Magsimula nang simple. Maaari mong buuin ang profile pagkatapos sumali.','Display name':'Pangalan sa profile','Email':'Email','Password':'Password','Confirm password':'Kumpirmahin ang password','Date of birth':'Petsa ng kapanganakan','Country':'Bansa','Create account':'Gumawa ng account','Gender':'Kasarian','Looking for':'Hinahanap','City':'Lungsod','Occupation':'Trabaho','Choose':'Pumili','Woman':'Babae','Man':'Lalaki','Everyone':'Lahat','Women':'Mga babae','Men':'Mga lalaki','Back':'Bumalik','Continue':'Magpatuloy','Finish profile':'Tapusin ang profile','Relationship goal':'Layunin sa relasyon','Serious relationship':'Seryosong relasyon','Marriage':'Kasal','Long-term dating':'Pangmatagalang pakikipag-date','See where it goes':'Tingnan kung saan hahantong','Languages':'Mga Wika','Interests':'Mga Interes','About you':'Tungkol sa iyo','Meet with intention.':'Makipagkilala nang may malinaw na layunin.','Any country':'Anumang bansa','Min age':'Pinakamababang edad','Max age':'Pinakamataas na edad','Any goal':'Anumang layunin','Apply filters':'Ilapat ang filter','Reset filters':'I-reset ang filter','No more profiles right now':'Wala nang ibang profile sa ngayon','People who chose you back.':'Mga taong pinili ka rin.','No matches yet':'Wala pang match','Your conversations':'Mga usapan mo','Select a match':'Pumili ng match','Write a message…':'Sumulat ng mensahe…','Send':'Ipadala','Safety':'Kaligtasan','Unmatch':'Alisin ang match','Save profile':'I-save ang profile','Change password':'Palitan ang password','Current password':'Kasalukuyang password','New password':'Bagong password','Update':'I-update','Show me in Discover':'Ipakita ako sa Tuklasin','Delete account':'Burahin ang account','Report':'I-report','Block':'I-block','Reason':'Dahilan','Choose a reason':'Pumili ng dahilan','Find Your Person,':'Hanapin ang Iyong Tao,','Anywhere.':'Kahit Saan.','GLOBAL • SERIOUS • INTENTIONAL':'GLOBAL • SERYOSO • MAY LAYUNIN','18+ only':'18+ lamang','Mutual matches':'Parehong pumili','Safety tools built in':'May safety tools','Intent first':'Layunin muna','Match mutually':'Parehong mag-match','Date with confidence':'Makipag-date nang may kumpiyansa','WELCOME TO VOWSI':'MALIGAYANG PAGDATING SA VOWSI','PROFILE SETUP':'PAG-SET UP NG PROFILE','THE BASICS':'MGA PANGUNAHING IMPORMASYON','YOUR INTENT':'IYONG LAYUNIN','MAKE IT YOURS':'GAWIN ITONG IYO','Your photos':'Mga larawan mo','+ Add photos':'+ Magdagdag ng larawan','Show who you really are.':'Ipakita kung sino ka talaga.','No conversations yet.':'Wala pang usapan.','Choose a conversation to start chatting.':'Pumili ng usapan para magsimulang mag-chat.'},
  nl:{'Discover':'Ontdekken','Matches':'Matches','Messages':'Berichten','Profile':'Profiel','Settings':'Instellingen','Sign in':'Inloggen','Join VOWSI':'Word lid van VOWSI','Log out':'Uitloggen','Country':'Land','City':'Stad','Continue':'Doorgaan','Back':'Terug','Save profile':'Profiel opslaan','Safety':'Veiligheid','Report':'Melden','Block':'Blokkeren'},
  pl:{'Discover':'Odkrywaj','Matches':'Dopasowania','Messages':'Wiadomości','Profile':'Profil','Settings':'Ustawienia','Sign in':'Zaloguj się','Join VOWSI':'Dołącz do VOWSI','Log out':'Wyloguj','Country':'Kraj','City':'Miasto','Continue':'Dalej','Back':'Wstecz','Save profile':'Zapisz profil','Safety':'Bezpieczeństwo','Report':'Zgłoś','Block':'Zablokuj'},
  tr:{'Discover':'Keşfet','Matches':'Eşleşmeler','Messages':'Mesajlar','Profile':'Profil','Settings':'Ayarlar','Sign in':'Giriş yap','Join VOWSI':'VOWSI’ye katıl','Log out':'Çıkış yap','Country':'Ülke','City':'Şehir','Continue':'Devam','Back':'Geri','Save profile':'Profili kaydet','Safety':'Güvenlik','Report':'Bildir','Block':'Engelle'},
  ru:{'Discover':'Поиск','Matches':'Совпадения','Messages':'Сообщения','Profile':'Профиль','Settings':'Настройки','Sign in':'Войти','Join VOWSI':'Присоединиться к VOWSI','Log out':'Выйти','Country':'Страна','City':'Город','Continue':'Продолжить','Back':'Назад','Save profile':'Сохранить профиль','Safety':'Безопасность','Report':'Пожаловаться','Block':'Заблокировать'},
  uk:{'Discover':'Знайомства','Matches':'Збіги','Messages':'Повідомлення','Profile':'Профіль','Settings':'Налаштування','Sign in':'Увійти','Join VOWSI':'Приєднатися до VOWSI','Log out':'Вийти','Country':'Країна','City':'Місто','Continue':'Продовжити','Back':'Назад','Save profile':'Зберегти профіль','Safety':'Безпека','Report':'Поскаржитися','Block':'Заблокувати'},
  fa:{'Discover':'کشف','Matches':'تطابق‌ها','Messages':'پیام‌ها','Profile':'پروفایل','Settings':'تنظیمات','Sign in':'ورود','Join VOWSI':'پیوستن به VOWSI','Log out':'خروج','Country':'کشور','City':'شهر','Continue':'ادامه','Back':'بازگشت','Save profile':'ذخیره پروفایل','Safety':'ایمنی','Report':'گزارش','Block':'مسدود کردن'},
  bn:{'Discover':'খুঁজুন','Matches':'ম্যাচ','Messages':'বার্তা','Profile':'প্রোফাইল','Settings':'সেটিংস','Sign in':'সাইন ইন','Join VOWSI':'VOWSI-তে যোগ দিন','Log out':'লগ আউট','Country':'দেশ','City':'শহর','Continue':'চালিয়ে যান','Back':'ফিরে যান','Save profile':'প্রোফাইল সংরক্ষণ','Safety':'নিরাপত্তা','Report':'রিপোর্ট','Block':'ব্লক'},
  ur:{'Discover':'دریافت کریں','Matches':'میچز','Messages':'پیغامات','Profile':'پروفائل','Settings':'ترتیبات','Sign in':'سائن ان','Join VOWSI':'VOWSI میں شامل ہوں','Log out':'لاگ آؤٹ','Country':'ملک','City':'شہر','Continue':'جاری رکھیں','Back':'واپس','Save profile':'پروفائل محفوظ کریں','Safety':'حفاظت','Report':'رپورٹ','Block':'بلاک'},
  id:{'Discover':'Jelajahi','Matches':'Kecocokan','Messages':'Pesan','Profile':'Profil','Settings':'Pengaturan','Sign in':'Masuk','Join VOWSI':'Gabung VOWSI','Log out':'Keluar','Country':'Negara','City':'Kota','Continue':'Lanjutkan','Back':'Kembali','Save profile':'Simpan profil','Safety':'Keamanan','Report':'Laporkan','Block':'Blokir'},
  ms:{'Discover':'Terokai','Matches':'Padanan','Messages':'Mesej','Profile':'Profil','Settings':'Tetapan','Sign in':'Log masuk','Join VOWSI':'Sertai VOWSI','Log out':'Log keluar','Country':'Negara','City':'Bandar','Continue':'Teruskan','Back':'Kembali','Save profile':'Simpan profil','Safety':'Keselamatan','Report':'Lapor','Block':'Sekat'},
  sw:{'Discover':'Gundua','Matches':'Mechi','Messages':'Ujumbe','Profile':'Wasifu','Settings':'Mipangilio','Sign in':'Ingia','Join VOWSI':'Jiunge na VOWSI','Log out':'Toka','Country':'Nchi','City':'Jiji','Continue':'Endelea','Back':'Rudi','Save profile':'Hifadhi wasifu','Safety':'Usalama','Report':'Ripoti','Block':'Zuia'}
});

Object.assign(UI_TRANSLATIONS.vi,{"GLOBAL • SERIOUS • INTENTIONAL": "TOÀN CẦU • NGHIÊM TÚC • CÓ CHỦ ĐÍCH", "WELCOME TO VOWSI": "CHÀO MỪNG ĐẾN VOWSI", "Your first name": "Tên của bạn", "At least 10 characters": "Ít nhất 10 ký tự", "Type your password again": "Nhập lại mật khẩu", "Choose your country": "Chọn quốc gia của bạn", "VOWSI does not create fake profiles or fake messages.": "VOWSI không tạo hồ sơ giả hoặc tin nhắn giả.", "BASIC INFO": "THÔNG TIN CƠ BẢN", "Help the right people understand you.": "Giúp người phù hợp hiểu bạn hơn.", "Your signup details are already here. Check them and add a little more.": "Thông tin đăng ký đã có sẵn. Hãy kiểm tra và bổ sung thêm một chút.", "Search or type your city": "Tìm kiếm hoặc nhập thành phố của bạn", "What do you do?": "Nghề nghiệp của bạn", "YOUR INTENT": "MỤC TIÊU CỦA BẠN", "What are you hoping to find?": "Bạn đang tìm kiếm điều gì?", "Clear intent makes for better matches and conversations.": "Mục tiêu rõ ràng giúp tạo nên những tương hợp và cuộc trò chuyện tốt hơn.", "Choose languages below": "Chọn ngôn ngữ bên dưới", "Choose your interests below": "Chọn sở thích bên dưới", "Open to see where it goes": "Cởi mở tìm hiểu", "BE YOURSELF": "HÃY LÀ CHÍNH MÌNH", "Add photos and a little about you.": "Thêm ảnh và giới thiệu đôi chút về bản thân.", "A clear photo and a short introduction are enough to get started.": "Một ảnh rõ nét và phần giới thiệu ngắn là đủ để bắt đầu.", "Your photos": "Ảnh của bạn", "JPG, PNG or WebP • up to 3 MB each • max 6": "JPG, PNG hoặc WebP • tối đa 3 MB/ảnh • tối đa 6 ảnh", "Tell us a little about yourself.": "Hãy chia sẻ một chút về bản thân.", "Step 1 of 3": "Bước 1/3", "Step 2 of 3": "Bước 2/3", "Step 3 of 3": "Bước 3/3", "Adjust preferences without leaving the page.": "Điều chỉnh tiêu chí ngay trên trang này.", "Try widening your filters or come back later.": "Hãy thử mở rộng bộ lọc hoặc quay lại sau.", "Open a conversation whenever you’re ready.": "Bắt đầu trò chuyện bất cứ khi nào bạn sẵn sàng.", "Open a conversation whenever you're ready.": "Bắt đầu trò chuyện bất cứ khi nào bạn sẵn sàng.", "When someone you like chooses you back, they'll appear here.": "Khi người bạn thích cũng chọn bạn, họ sẽ xuất hiện ở đây.", "Your messages stay between you and your match.": "Tin nhắn chỉ được chia sẻ giữa bạn và người tương hợp.", "A thoughtful profile makes better conversations easier.": "Một hồ sơ chỉn chu giúp những cuộc trò chuyện tốt đẹp bắt đầu dễ dàng hơn.", "Drag-free simple ordering: use “Make first” to choose your main photo.": "Dùng “Đặt làm ảnh chính” để chọn ảnh đại diện.", "Make first": "Đặt làm ảnh chính", "Main": "Ảnh chính", "Remove": "Xóa", "SETTINGS & SAFETY": "CÀI ĐẶT & AN TOÀN", "You stay in control.": "Bạn luôn là người kiểm soát.", "Manage visibility, security and your account.": "Quản lý hiển thị, bảo mật và tài khoản của bạn.", "Use at least 10 characters and keep it unique to VOWSI.": "Dùng ít nhất 10 ký tự và không dùng lại mật khẩu ở nơi khác.", "Turn this off to pause new discovery while keeping existing matches and messages.": "Tắt mục này để tạm ẩn khỏi Khám phá nhưng vẫn giữ các tương hợp và tin nhắn hiện có.", "Safety reminder": "Nhắc nhở an toàn", "Never send money to someone you meet online. Report suspicious behavior and meet in public first.": "Không gửi tiền cho người bạn gặp trực tuyến. Hãy báo cáo hành vi đáng ngờ và ưu tiên gặp ở nơi công cộng.", "This permanently removes your profile, likes, matches and messages.": "Thao tác này sẽ xóa vĩnh viễn hồ sơ, lượt thích, tương hợp và tin nhắn của bạn.", "SAFETY": "AN TOÀN", "Use these tools whenever something feels wrong.": "Hãy sử dụng các công cụ này bất cứ khi nào bạn cảm thấy có điều không ổn.", "Message": "Nhắn tin", "Pass": "Bỏ qua", "Like ♥": "Thích ♥", "Not listed": "Chưa cung cấp", "Travel": "Du lịch", "Music": "Âm nhạc", "Fitness": "Thể hình", "Cooking": "Nấu ăn", "Movies": "Phim ảnh", "Reading": "Đọc sách", "Art": "Nghệ thuật", "Nature": "Thiên nhiên", "Photography": "Nhiếp ảnh", "Gaming": "Trò chơi", "Sports": "Thể thao", "Hiking": "Đi bộ đường dài", "Pets": "Thú cưng", "Dancing": "Khiêu vũ", "Fashion": "Thời trang", "Beauty": "Làm đẹp", "Technology": "Công nghệ", "Business": "Kinh doanh", "Volunteering": "Tình nguyện", "Gardening": "Làm vườn", "Coffee": "Cà phê", "Food": "Ẩm thực", "Writing": "Viết lách", "English": "Tiếng Anh", "Spanish": "Tiếng Tây Ban Nha", "French": "Tiếng Pháp", "German": "Tiếng Đức", "Italian": "Tiếng Ý", "Portuguese": "Tiếng Bồ Đào Nha", "Vietnamese": "Tiếng Việt", "Chinese": "Tiếng Trung", "Japanese": "Tiếng Nhật", "Korean": "Tiếng Hàn", "Arabic": "Tiếng Ả Rập", "Hindi": "Tiếng Hindi", "Thai": "Tiếng Thái", "Indonesian": "Tiếng Indonesia", "Russian": "Tiếng Nga", "Dutch": "Tiếng Hà Lan", "Turkish": "Tiếng Thổ Nhĩ Kỳ", "Polish": "Tiếng Ba Lan", "Swedish": "Tiếng Thụy Điển", "Greek": "Tiếng Hy Lạp"});
const _textOriginals=new WeakMap(),_attrOriginals=new WeakMap();
let currentUiLang='en';
function uiLang(){return currentUiLang;}
function tr(text){const s=String(text??'');return UI_TRANSLATIONS[uiLang()]?.[s]||s;}
function applyLanguage(lang=uiLang()){
  if(!UI_LANGS.includes(lang))lang='en';currentUiLang=lang;document.documentElement.lang=lang;document.documentElement.dir=['ar','fa','ur'].includes(lang)?'rtl':'ltr';
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
    if(!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName))continue;
    if(!_textOriginals.has(node))_textOriginals.set(node,node.nodeValue);
    const original=_textOriginals.get(node),lead=original.match(/^\s*/)?.[0]||'',trail=original.match(/\s*$/)?.[0]||'',core=original.trim();
    if(core)node.nodeValue=lead+(UI_TRANSLATIONS[lang]?.[core]||core)+trail;
  }
  document.querySelectorAll('input[placeholder],textarea[placeholder],button[title],[aria-label]').forEach(el=>{
    if(!_attrOriginals.has(el))_attrOriginals.set(el,{});const memo=_attrOriginals.get(el);
    for(const a of ['placeholder','title','aria-label'])if(el.hasAttribute(a)){if(!(a in memo))memo[a]=el.getAttribute(a);const o=memo[a];el.setAttribute(a,UI_TRANSLATIONS[lang]?.[o]||o);}
  });
  document.querySelectorAll('select option').forEach(opt=>{const node=opt.firstChild;if(node&&!_textOriginals.has(node))_textOriginals.set(node,opt.textContent);const o=node?_textOriginals.get(node):opt.textContent;if(o){if(!opt.hasAttribute('value'))opt.value=o;opt.textContent=UI_TRANSLATIONS[lang]?.[o]||o;}});
  const sel=$('#uiLanguage');if(sel)sel.value=lang;initCountries();
}
function detectLanguage(){const saved=localStorage.getItem('vowsi_ui_language');if(saved&&UI_LANGS.includes(saved))return saved;const aliases={tl:'fil',in:'id'};const prefs=[...(navigator.languages||[]),navigator.language].filter(Boolean);for(const raw of prefs){let base=String(raw).toLowerCase().split('-')[0];base=aliases[base]||base;if(UI_LANGS.includes(base))return base;}return 'en';}

const HERO_PHOTOS = ['/02-sunset.webp','/06-city.webp','/09-mature.webp','/04-window.webp','/05-asian-western.webp','/10-park.webp','/08-cabin.webp','/07-outdoors.webp','/01-cafe.webp','/03-global.webp'];
const LANGUAGES = ['English','Spanish','French','German','Italian','Portuguese','Vietnamese','Chinese','Japanese','Korean','Arabic','Hindi','Thai','Indonesian','Russian','Dutch','Turkish','Polish','Swedish','Greek'];
const INTERESTS = ['Travel','Music','Fitness','Cooking','Movies','Reading','Art','Nature','Photography','Gaming','Sports','Hiking','Pets','Dancing','Fashion','Beauty','Technology','Business','Volunteering','Gardening','Coffee','Food','Writing','Languages'];
const CAPITAL_CITIES = {"Afghanistan":["Kabul"],"Albania":["Tirana"],"Algeria":["Algiers"],"Angola":["Luanda"],"Antigua and Barbuda":["Saint John's"],"Argentina":["Buenos Aires"],"Armenia":["Yerevan"],"Australia":["Canberra"],"Austria":["Vienna"],"Azerbaijan":["Baku"],"Bahrain":["Manama"],"Bangladesh":["Dhaka"],"Barbados":["Bridgetown"],"Belarus":["Minsk"],"Belgium":["Brussels"],"Belize":["Belmopan"],"Benin":["Porto-Novo"],"Bhutan":["Thimphu"],"Bolivia":["Sucre"],"Bosnia and Herzegovina":["Sarajevo"],"Botswana":["Gaborone"],"Brazil":["Brasília"],"Brunei":["Bandar Seri Begawan"],"Bulgaria":["Sofia"],"Burkina Faso":["Ouagadougou"],"Burundi":["Bujumbura"],"Cambodia":["Phnom Penh"],"Cameroon":["Yaoundé"],"Canada":["Ottawa"],"Central African Republic":["Bangui"],"Chad":["N'Djamena"],"Chile":["Santiago"],"China":["Beijing"],"Colombia":["Bogotá"],"Comoros":["Moroni"],"Costa Rica":["San José"],"Croatia":["Zagreb"],"Cuba":["Havana"],"Cyprus":["Nicosia"],"Democratic Republic of the Congo":["Kinshasa"],"Denmark":["Copenhagen"],"Djibouti":["Djibouti"],"Dominica":["Roseau"],"Dominican Republic":["Santo Domingo"],"Ecuador":["Quito"],"Egypt":["Cairo"],"El Salvador":["San Salvador"],"Equatorial Guinea":["Malabo"],"Eritrea":["Asmara"],"Estonia":["Tallinn"],"Ethiopia":["Addis Ababa"],"Fiji":["Suva"],"Finland":["Helsinki"],"France":["Paris"],"Gabon":["Libreville"],"Georgia":["Tbilisi"],"Germany":["Berlin"],"Ghana":["Accra"],"Greece":["Athens"],"Grenada":["St. George's"],"Guatemala":["Guatemala City"],"Guinea":["Conakry"],"Guinea-Bissau":["Bissau"],"Guyana":["Georgetown"],"Haiti":["Port-au-Prince"],"Honduras":["Tegucigalpa"],"Hungary":["Budapest"],"Iceland":["Reykjavik"],"India":["New Delhi"],"Indonesia":["Jakarta"],"Iran":["Tehran"],"Iraq":["Baghdad"],"Ireland":["Dublin"],"Israel":["Jerusalem"],"Italy":["Rome"],"Ivory Coast":["Yamoussoukro"],"Jamaica":["Kingston"],"Japan":["Tokyo"],"Jordan":["Amman"],"Kazakhstan":["Astana"],"Kenya":["Nairobi"],"Kiribati":["South Tarawa"],"Kuwait":["Kuwait City"],"Kyrgyzstan":["Bishkek"],"Laos":["Vientiane"],"Latvia":["Riga"],"Lebanon":["Beirut"],"Lesotho":["Maseru"],"Liberia":["Monrovia"],"Libya":["Tripoli"],"Liechtenstein":["Vaduz"],"Lithuania":["Vilnius"],"Luxembourg":["Luxembourg"],"Madagascar":["Antananarivo"],"Malawi":["Lilongwe"],"Malaysia":["Kuala Lumpur"],"Maldives":["Malé"],"Mali":["Bamako"],"Malta":["Valletta"],"Marshall Islands":["Majuro"],"Mauritania":["Nouakchott"],"Mauritius":["Port Louis"],"Mexico":["Mexico City"],"Moldova":["Chișinău"],"Monaco":["Monaco"],"Mongolia":["Ulan Bator"],"Morocco":["Rabat"],"Mozambique":["Maputo"],"Namibia":["Windhoek"],"Nauru":["Yaren"],"Nepal":["Kathmandu"],"Netherlands":["Amsterdam"],"New Zealand":["Wellington"],"Nicaragua":["Managua"],"Niger":["Niamey"],"Nigeria":["Abuja"],"North Korea":["Pyongyang"],"Norway":["Oslo"],"Oman":["Muscat"],"Pakistan":["Islamabad"],"Palau":["Ngerulmud"],"Panama":["Panama City"],"Papua New Guinea":["Port Moresby"],"Paraguay":["Asunción"],"Peru":["Lima"],"Philippines":["Manila"],"Poland":["Warsaw"],"Portugal":["Lisbon"],"Qatar":["Doha"],"Republic of the Congo":["Brazzaville"],"Romania":["Bucharest"],"Russia":["Moscow"],"Rwanda":["Kigali"],"Saint Kitts and Nevis":["Basseterre"],"Saint Lucia":["Castries"],"Saint Vincent and the Grenadines":["Kingstown"],"Samoa":["Apia"],"San Marino":["City of San Marino"],"Saudi Arabia":["Riyadh"],"Senegal":["Dakar"],"Serbia":["Belgrade"],"Seychelles":["Victoria"],"Sierra Leone":["Freetown"],"Singapore":["Singapore"],"Slovakia":["Bratislava"],"Slovenia":["Ljubljana"],"Solomon Islands":["Honiara"],"Somalia":["Mogadishu"],"South Africa":["Pretoria"],"South Korea":["Seoul"],"South Sudan":["Juba"],"Spain":["Madrid"],"Sri Lanka":["Colombo"],"Sudan":["Khartoum"],"Suriname":["Paramaribo"],"Sweden":["Stockholm"],"Switzerland":["Bern"],"Syria":["Damascus"],"Taiwan":["Taipei"],"Tajikistan":["Dushanbe"],"Tanzania":["Dodoma"],"Thailand":["Bangkok"],"Togo":["Lomé"],"Tonga":["Nuku'alofa"],"Trinidad and Tobago":["Port of Spain"],"Tunisia":["Tunis"],"Turkey":["Ankara"],"Turkmenistan":["Ashgabat"],"Tuvalu":["Funafuti"],"Uganda":["Kampala"],"Ukraine":["Kiev"],"United Arab Emirates":["Abu Dhabi"],"United Kingdom":["London"],"United States":["Washington, D.C."],"Uruguay":["Montevideo"],"Uzbekistan":["Tashkent"],"Vanuatu":["Port Vila"],"Venezuela":["Caracas"],"Vietnam":["Hanoi"],"Yemen":["Sana'a"],"Zambia":["Lusaka"],"Zimbabwe":["Harare"],"Vatican City":["Vatican City"],"Czechia":["Prague"],"Eswatini":["Mbabane"],"Myanmar":["Naypyidaw"],"Cabo Verde":["Praia"]};
const CITIES = {
  'Vietnam':['Ho Chi Minh City','Hanoi','Da Nang','Can Tho','Hai Phong','Nha Trang','Hue','Da Lat'], 'United States':['New York','Los Angeles','Chicago','Houston','San Francisco','Miami','Boston','Seattle','Austin','Washington'],
  'United Kingdom':['London','Manchester','Birmingham','Liverpool','Edinburgh','Glasgow','Bristol'], 'Canada':['Toronto','Vancouver','Montreal','Calgary','Ottawa','Edmonton'],
  'Australia':['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'], 'France':['Paris','Lyon','Marseille','Toulouse','Nice','Bordeaux'], 'Germany':['Berlin','Munich','Hamburg','Frankfurt','Cologne','Düsseldorf'],
  'Italy':['Rome','Milan','Florence','Naples','Turin','Bologna','Venice'], 'Spain':['Madrid','Barcelona','Valencia','Seville','Malaga'], 'Portugal':['Lisbon','Porto','Braga'],
  'Japan':['Tokyo','Osaka','Kyoto','Yokohama','Nagoya','Sapporo','Fukuoka'], 'South Korea':['Seoul','Busan','Incheon','Daegu','Daejeon'], 'China':['Beijing','Shanghai','Guangzhou','Shenzhen','Chengdu','Hangzhou'],
  'Taiwan':['Taipei','Kaohsiung','Taichung','Tainan'], 'Thailand':['Bangkok','Chiang Mai','Phuket','Pattaya'], 'Singapore':['Singapore'], 'Malaysia':['Kuala Lumpur','Penang','Johor Bahru'],
  'Indonesia':['Jakarta','Bali','Surabaya','Bandung'], 'Philippines':['Manila','Cebu City','Davao City'], 'India':['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai','Kolkata'],
  'Russia':['Moscow','Saint Petersburg','Novosibirsk','Kazan','Sochi'], 'Ukraine':['Kyiv','Lviv','Odesa'], 'Poland':['Warsaw','Krakow','Wroclaw','Gdansk'], 'Netherlands':['Amsterdam','Rotterdam','The Hague','Utrecht'],
  'Switzerland':['Zurich','Geneva','Basel','Bern'], 'Austria':['Vienna','Salzburg','Graz','Innsbruck'], 'Sweden':['Stockholm','Gothenburg','Malmö'], 'Norway':['Oslo','Bergen','Trondheim'],
  'Denmark':['Copenhagen','Aarhus'], 'Finland':['Helsinki','Tampere'], 'Ireland':['Dublin','Cork','Galway'], 'Belgium':['Brussels','Antwerp','Ghent'], 'Greece':['Athens','Thessaloniki','Patras','Piraeus','Heraklion','Larissa','Volos','Ioannina','Chania','Rhodes','Kalamata','Kavala','Serres','Alexandroupoli','Corfu','Trikala','Chalcis'],
  'Turkey':['Istanbul','Ankara','Izmir','Antalya'], 'United Arab Emirates':['Dubai','Abu Dhabi','Sharjah'], 'Saudi Arabia':['Riyadh','Jeddah'], 'Israel':['Tel Aviv','Jerusalem','Haifa'],
  'Brazil':['São Paulo','Rio de Janeiro','Brasília','Salvador'], 'Mexico':['Mexico City','Guadalajara','Monterrey','Cancún'], 'Argentina':['Buenos Aires','Córdoba','Mendoza'], 'Chile':['Santiago','Valparaíso'],
  'Colombia':['Bogotá','Medellín','Cartagena'], 'Peru':['Lima','Cusco'], 'South Africa':['Cape Town','Johannesburg','Durban','Pretoria'], 'Nigeria':['Lagos','Abuja'], 'Kenya':['Nairobi','Mombasa'],
  'Egypt':['Cairo','Alexandria','Giza','Shubra El Kheima','Port Said','Suez','Luxor','Mansoura','Tanta','Asyut','Ismailia','Faiyum','Zagazig','Aswan','Damietta','Hurghada','Sharm El Sheikh'], 'Morocco':['Casablanca','Marrakesh','Rabat'], 'New Zealand':['Auckland','Wellington','Christchurch']
};
function initHeroSlideshow(){
  const a=$('#heroPhotoA'),b=$('#heroPhotoB'),back=$('.hero-photo-backdrop');
  if(!a||!b||!back)return;
  HERO_PHOTOS.forEach(src=>{const img=new Image();img.src=src;});
  let idx=0,front=a,backImg=b,timer=null;
  const paint=()=>{back.style.backgroundImage=`url("${HERO_PHOTOS[idx]}")`;};
  const advance=()=>{
    idx=(idx+1)%HERO_PHOTOS.length;
    const nextSrc=HERO_PHOTOS[idx];
    const show=()=>{back.style.backgroundImage=`url("${nextSrc}")`;backImg.classList.add('active');front.classList.remove('active');[front,backImg]=[backImg,front];};
    if(backImg.src.endsWith(nextSrc)){show();return;}
    backImg.onload=()=>{backImg.onload=null;show();};
    backImg.src=nextSrc;
  };
  const start=()=>{if(timer||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;timer=setInterval(advance,2000);};
  const stop=()=>{clearInterval(timer);timer=null;};
  paint();start();
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
}
const cityCache=new Map();let cityRequestToken=0,cityDebounce=null;
function setCityStatus(message=''){document.querySelectorAll('[data-city-status]').forEach(el=>{el.textContent=message?tr(message):'';});}
function cityFallback(country){return [...(CITIES[country]||[]),...(CAPITAL_CITIES[country]||[])].filter((c,i,a)=>c&&a.indexOf(c)===i);}
function fillCityList(cities){const dl=$('#cityList');if(dl)dl.innerHTML=cities.map(c=>`<option value="${escapeHtml(c)}"></option>`).join('');}
async function updateCityList(country,query=''){
  const key=String(country||'').trim(),q=String(query||'').trim(),fallback=cityFallback(key);fillCityList(fallback);
  if(!key||!isCountry(key)){setCityStatus('');return;}
  const cacheKey=`${key.toLowerCase()}|${q.toLowerCase()}`;
  if(cityCache.has(cacheKey)){const cities=cityCache.get(cacheKey);fillCityList(cities);setCityStatus(`${cities.length} city suggestions available — you can still type your city.`);return;}
  const token=++cityRequestToken;setCityStatus(q.length>=2?'Searching cities…':'Loading city suggestions…');
  try{const result=await api(`/api/cities?country=${encodeURIComponent(key)}${q.length>=2?`&q=${encodeURIComponent(q)}`:''}`);if(token!==cityRequestToken)return;const cities=Array.isArray(result.cities)?result.cities:[];const preferred=fallback.filter(c=>!q||c.toLowerCase().includes(q.toLowerCase()));const merged=[...preferred,...cities].filter((c,i,a)=>c&&a.indexOf(c)===i).slice(0,500);cityCache.set(cacheKey,merged);fillCityList(merged);setCityStatus(`${merged.length} city suggestions available — you can still type your city.`);}
  catch{if(token!==cityRequestToken)return;fillCityList(fallback);setCityStatus('City suggestions are temporarily limited — you can still type your city.');}
}
function scheduleCitySearch(form){clearTimeout(cityDebounce);cityDebounce=setTimeout(()=>updateCityList(form?.elements.country?.value,form?.elements.city?.value),320);}
function renderChoiceChips(){$$('.language-suggestions').forEach(el=>el.innerHTML=LANGUAGES.map(x=>`<button type="button" data-language="${escapeHtml(x)}" data-form="${el.dataset.form||'onboardingForm'}">${escapeHtml(tr(x))}</button>`).join(''));$$('.interest-suggestions').forEach(el=>el.innerHTML=INTERESTS.map(x=>`<button type="button" data-interest="${escapeHtml(x)}" data-form="${el.dataset.form||'onboardingForm'}">${escapeHtml(tr(x))}</button>`).join(''));}
function syncChoiceChips(){for(const formId of ['onboardingForm','profileForm']){const form=$('#'+formId);if(!form)continue;const langs=(form.elements.languages?.value||'').split(',').map(x=>x.trim()).filter(Boolean);const ints=(form.elements.interests?.value||'').split(',').map(x=>x.trim()).filter(Boolean);$$(`[data-language][data-form="${formId}"]`).forEach(b=>b.classList.toggle('selected',langs.includes(b.dataset.language)));$$(`[data-interest][data-form="${formId}"]`).forEach(b=>b.classList.toggle('selected',ints.includes(b.dataset.interest)));}}
function toggleCsvField(formId,field,value,max=8){const form=$('#'+formId),input=form?.elements?.[field];if(!input)return;let arr=(input.value||'').split(',').map(x=>x.trim()).filter(Boolean);arr=arr.includes(value)?arr.filter(x=>x!==value):(arr.length<max?[...arr,value]:arr);input.value=arr.join(', ');syncChoiceChips();}

const state = {
  me: null,
  screen: 'landing',
  onboardingStep: 1,
  discover: [],
  discoverIndex: 0,
  matches: [],
  activeMatch: null,
  safetyTarget: null,
  pollTimer: null,
  onboardingDraft: null
};

async function api(url, options={}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: isForm ? (options.headers || {}) : { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    if (response.status === 401 && state.me) {
      stopPolling(); state.me=null; state.matches=[]; state.activeMatch=null;
      setAuthMode('login','Your session ended. Please sign in again.');
    }
    const err = new Error(data.error || 'Something went wrong.');
    err.field = data.field;
    throw err;
  }
  return data;
}

function toast(message, type='success', duration=2600) {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.className = 'toast', duration);
}

function showScreen(name) {
  state.screen = name;
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(`#${name}Screen`)?.classList.add('active');

  const loggedIn = Boolean(state.me);
  const appNavigationAllowed = loggedIn && !['onboarding','landing','auth'].includes(name);
  $('#appNav').classList.toggle('hidden', !appNavigationAllowed);
  $('#logoutBtn').classList.toggle('hidden', !loggedIn);
  $('#accountChip').classList.toggle('hidden', !loggedIn);
  if(loggedIn){$('#accountName').textContent=state.me.display_name||'Profile';$('#accountAvatar').textContent=initials(state.me.display_name);}
  $('#signInTop').classList.toggle('hidden', loggedIn);
  $('#joinTop').classList.toggle('hidden', loggedIn);
  $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function setAuthMode(mode, notice='') {
  const signup = mode === 'signup';
  $('#signupForm').classList.toggle('hidden', !signup);
  $('#loginForm').classList.toggle('hidden', signup);
  $('#signupTab').classList.toggle('active', signup);
  $('#loginTab').classList.toggle('active', !signup);
  $('#authHeadline').textContent = signup ? 'Create your account' : 'Welcome back';
  $('#authSubhead').textContent = signup
    ? 'Start simple. You can build your profile right after joining.'
    : 'Sign in and pick up exactly where you left off.';
  const noticeEl = $('#authNotice');
  noticeEl.textContent = notice;
  noticeEl.className = notice ? 'inline-notice success' : 'inline-notice success hidden';
  $('#loginError').classList.add('hidden');
  clearErrors($('#signupForm'));
  clearErrors($('#loginForm'));
  showScreen('auth');
}

function initials(name='?') { return name.trim().slice(0,1).toUpperCase() || '?'; }
function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function splitTags(v='') { return String(v).split(',').map(x => x.trim()).filter(Boolean).slice(0,10); }
function timeLabel(value) {
  if (!value) return '';
  const d = new Date(value), now = new Date(), diff = Math.max(0, now-d);
  if (diff < 60_000) return 'now';
  if (diff < 3_600_000) return `${Math.floor(diff/60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff/3_600_000)}h`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}

function formPayload(form) {
  const d = new FormData(form);
  const obj = {};
  for (const [k,v] of d.entries()) obj[k] = typeof v === 'string' ? v.trim() : v;
  return obj;
}

function clearErrors(root=document) {
  $$('.field-error', root).forEach(el => { el.textContent=''; el.classList.remove('show'); });
  $$('input,select,textarea', root).forEach(el => el.classList.remove('invalid'));
}

function fieldError(form, name, message, alias=name) {
  const target = form?.querySelector?.(`[name="${name}"]`);
  target?.classList?.add('invalid');
  const err = form?.querySelector(`[data-error-for="${alias}"]`) || document.querySelector(`[data-error-for="${alias}"]`);
  if (err) { err.textContent = message; err.classList.add('show'); }
  return false;
}

function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function ageFromDate(value) {
  const b = new Date(value); if (Number.isNaN(b.getTime())) return -1;
  const n = new Date(); let y = n.getFullYear()-b.getFullYear();
  if (n < new Date(n.getFullYear(),b.getMonth(),b.getDate())) y--;
  return y;
}

function validateSignup() {
  const form = $('#signupForm'); clearErrors(form); const p=formPayload(form); let ok=true;
  if (!p.displayName) ok=fieldError(form,'displayName','Enter your display name.') && ok;
  if (!p.email || !validEmail(p.email)) ok=fieldError(form,'email','Enter a valid email address.') && ok;
  if (!p.password || p.password.length<10) ok=fieldError(form,'password','Use at least 10 characters.') && ok;
  if (!p.confirmPassword) ok=fieldError(form,'confirmPassword','Type your password again.') && ok;
  else if (p.confirmPassword !== p.password) ok=fieldError(form,'confirmPassword','Passwords do not match.') && ok;
  if (!p.birthDate) ok=fieldError(form,'birthDate','Choose your date of birth.') && ok;
  else if (ageFromDate(p.birthDate)<18) ok=fieldError(form,'birthDate','VOWSI is for adults 18+ only.') && ok;
  if (!p.country) ok=fieldError(form,'country','Choose your country.') && ok;
  else if(!isCountry(p.country)) ok=fieldError(form,'country','Choose a country from the list.') && ok;
  if (!form.elements.acceptedTerms.checked) ok=fieldError(form,'acceptedTerms','Please accept the Terms and Community Guidelines.','acceptedTerms') && ok;
  return ok;
}

function validateLogin() {
  const form=$('#loginForm'); clearErrors(form); $('#loginError').classList.add('hidden'); const p=formPayload(form); let ok=true;
  if (!p.email || !validEmail(p.email)) ok=fieldError(form,'email','Enter your email address.','loginEmail') && ok;
  if (!p.password) ok=fieldError(form,'password','Enter your password.','loginPassword') && ok;
  return ok;
}

async function bootstrap() {
  try {
    state.me = await api('/api/me');
    hydrateForms(state.me);
    startPolling();
    if (!state.me.profile_completed) startOnboarding();
    else { showScreen('discover'); await Promise.all([loadDiscover(),loadMatches()]); }
  } catch {
    state.me=null; showScreen('landing');
  }
}

function setRadio(form, name, value) {
  const radio = form?.elements?.[name];
  if (!radio || !value) return;
  [...radio].forEach?.(r => { r.checked = r.value === value; });
}

function hydrateForms(p) {
  if (!p) return;
  const map={displayName:p.display_name,country:p.country,city:p.city,occupation:p.occupation,gender:p.gender,lookingFor:p.looking_for||'Everyone',languages:p.languages,interests:p.interests,bio:p.bio};
  for (const form of [$('#profileForm'),$('#onboardingForm')]) {
    if (!form) continue;
    Object.entries(map).forEach(([name,value])=>{ if(form.elements[name]) form.elements[name].value=value||''; });
  }
  setRadio($('#onboardingForm'),'relationshipGoal',p.relationship_goal);
  if ($('#profileForm')?.elements.relationshipGoal) $('#profileForm').elements.relationshipGoal.value=p.relationship_goal||'';
  $('#discoveryToggle').checked=Boolean(p.discovery_enabled);
  updateCityList(p.country); syncChoiceChips();
  renderPhotos();
}

function captureOnboardingDraft() {
  const form=$('#onboardingForm'); if(!form)return null;
  const draft=formPayload(form);
  draft.relationshipGoal=[...form.elements.relationshipGoal].find(r=>r.checked)?.value||'';
  state.onboardingDraft=draft; return draft;
}
function restoreOnboardingDraft(draft=state.onboardingDraft) {
  const form=$('#onboardingForm'); if(!form||!draft)return;
  for(const [name,value] of Object.entries(draft)){
    if(name==='relationshipGoal')continue;
    if(form.elements[name])form.elements[name].value=value??'';
  }
  setRadio(form,'relationshipGoal',draft.relationshipGoal);
  updateCityList(form.elements.country?.value); syncChoiceChips();
}
function startOnboarding() {
  state.onboardingStep=1;
  if(!state.onboardingDraft) captureOnboardingDraft();
  updateOnboarding(); showScreen('onboarding'); restoreOnboardingDraft(); renderPhotos();
}

function updateOnboarding() {
  $$('.onboarding-step').forEach(step=>step.classList.toggle('active',Number(step.dataset.step)===state.onboardingStep));
  $('#progressText').textContent=`Step ${state.onboardingStep} of 3`;
  $('#progressBar').style.width=`${state.onboardingStep*33.333}%`;
  $('#onboardingBack').classList.toggle('hidden',state.onboardingStep===1);
  $('#onboardingNext').classList.toggle('hidden',state.onboardingStep===3);
  $('#onboardingSave').classList.toggle('hidden',state.onboardingStep!==3);
  clearErrors($('#onboardingForm'));
  window.scrollTo({top:0,behavior:'auto'});
}

function validateOnboardingStep(step) {
  const form=$('#onboardingForm'); clearErrors(form); let ok=true;
  if (step===1) {
    if (!form.elements.displayName.value.trim()) ok=fieldError(form,'displayName','Add your display name.') && ok;
    if (!form.elements.country.value.trim()) ok=fieldError(form,'country','Choose your country.') && ok;
    else if(!isCountry(form.elements.country.value)) ok=fieldError(form,'country','Choose a country from the list.') && ok;
    if (!['Woman','Man'].includes(form.elements.gender.value)) ok=fieldError(form,'gender','Choose Woman or Man.') && ok;
  }
  if (step===2) {
    const goal=[...form.elements.relationshipGoal].find(r=>r.checked)?.value;
    if (!goal) ok=fieldError(form,'relationshipGoal','Choose what you are hoping to find.') && ok;
  }
  if (step===3) {
    if (!(state.me?.photos?.length || state.me?.photo_url)) { const el=document.querySelector('[data-error-for="photos"]'); el.textContent='Add at least one photo.'; el.classList.add('show'); ok=false; }
    if (!form.elements.bio.value.trim()) ok=fieldError(form,'bio','Write a short bio so people know a little about you.') && ok;
  }
  return ok;
}

function onboardingPayload() {
  const form=$('#onboardingForm'); const p=formPayload(form);
  p.relationshipGoal=[...form.elements.relationshipGoal].find(r=>r.checked)?.value||'';
  return p;
}

async function saveOnboarding() {
  const payload=onboardingPayload();
  const saved=await api('/api/profile',{method:'PUT',body:JSON.stringify(payload)});
  state.me=saved; state.onboardingDraft=null; hydrateForms(saved); return saved;
}

function renderPhotos() {
  const photos=state.me?.photos||[];
  for (const id of ['onboardingPhotos','profilePhotos']) {
    const root=$(`#${id}`); if(!root) continue;
    root.innerHTML='';
    photos.forEach((photo,index)=>{
      const item=document.createElement('div'); item.className='photo-tile';
      item.innerHTML=`<img src="${escapeHtml(photo.url)}" alt="Profile photo ${index+1}"><div class="photo-actions">${index?`<button type="button" data-photo-first="${photo.id}">Make first</button>`:'<span>Main</span>'}<button type="button" data-photo-delete="${photo.id}">Remove</button></div>`;
      root.appendChild(item);
    });
    if (!photos.length && state.me?.photo_url) {
      const item=document.createElement('div'); item.className='photo-tile legacy-photo'; item.innerHTML=`<img src="${escapeHtml(state.me.photo_url)}" alt="Current profile photo"><div class="photo-actions"><span>Current photo</span></div>`; root.appendChild(item);
    }
    for(let i=(photos.length || (state.me?.photo_url?1:0)); i<Math.min(6,Math.max(3,(photos.length||0)+1)); i++) {
      const empty=document.createElement('label'); empty.className='photo-tile empty'; empty.innerHTML=`<span>+</span><small>Add photo</small><input type="file" accept="image/jpeg,image/png,image/webp" hidden data-inline-photo>`; root.appendChild(empty);
    }
  }
}

async function optimizeImage(file){
  if(!file?.type?.startsWith('image/')) return file;
  try{
    const bitmap=await createImageBitmap(file), max=1400, scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
    const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.84));
    return blob ? new File([blob],(file.name||'photo').replace(/\.[^.]+$/, '')+'.jpg',{type:'image/jpeg'}) : file;
  }catch{return file;}
}

async function uploadFiles(fileList) {
  const draft=state.screen==='onboarding'?captureOnboardingDraft():null;
  const files=[...fileList].slice(0,Math.max(0,6-(state.me?.photos?.length||0)));
  if (!files.length) return;
  for (const file of files) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { toast('Use JPG, PNG or WebP images.','error'); continue; }
    if (file.size>3*1024*1024) { toast(`${file.name} is larger than 3 MB.`,'error'); continue; }
    const optimized=await optimizeImage(file); const fd=new FormData(); fd.append('photo',optimized);
    try { await api('/api/photos',{method:'POST',body:fd}); }
    catch(e){ toast(e.message,'error',4000); }
  }
  state.me=await api('/api/me'); hydrateForms(state.me); if(draft)restoreOnboardingDraft(draft); renderPhotos();
}

async function deletePhoto(id) {
  const draft=state.screen==='onboarding'?captureOnboardingDraft():null;
  try { await api(`/api/photos/${id}`,{method:'DELETE'}); state.me=await api('/api/me'); hydrateForms(state.me); if(draft)restoreOnboardingDraft(draft); renderPhotos(); toast('Photo removed.'); }
  catch(e){toast(e.message,'error');}
}

async function makePhotoFirst(id) {
  const draft=state.screen==='onboarding'?captureOnboardingDraft():null;
  const ids=(state.me?.photos||[]).map(p=>p.id); const idx=ids.indexOf(Number(id)); if(idx<0)return;
  ids.splice(idx,1); ids.unshift(Number(id));
  try { const result=await api('/api/photos/order',{method:'PUT',body:JSON.stringify({ids})}); state.me.photos=result.photos; state.me.photo_url=result.photos[0]?.url||state.me.photo_url; if(draft)restoreOnboardingDraft(draft); renderPhotos(); toast('Main photo updated ✓'); }
  catch(e){toast(e.message,'error');}
}

function currentProfile(){return state.discover[state.discoverIndex];}
function nextProfile(){state.discoverIndex++;renderDiscover();}

async function loadDiscover() {
  if(!state.me?.profile_completed)return;
  $('#discoverLoading').classList.remove('hidden'); $('#discoverEmpty').classList.add('hidden'); $('#profileCard').classList.add('hidden');
  try { const qs=new URLSearchParams(formPayload($('#filterForm'))).toString(); state.discover=await api(`/api/discover?${qs}`); state.discoverIndex=0; renderDiscover(); }
  catch(e){toast(e.message,'error');}
  finally{$('#discoverLoading').classList.add('hidden');}
}

function renderDiscover() {
  const p=currentProfile(),card=$('#profileCard');
  if(!p){card.classList.add('hidden');$('#discoverEmpty').classList.remove('hidden');return;}
  $('#discoverEmpty').classList.add('hidden'); const interests=splitTags(p.interests);
  card.innerHTML=`<div class="profile-photo">${p.photo_url?`<img class="photo-backdrop" src="${escapeHtml(p.photo_url)}" alt=""><img class="photo-main" src="${escapeHtml(p.photo_url)}" alt="${escapeHtml(p.display_name)}">`:`<span class="placeholder">${escapeHtml(initials(p.display_name))}</span>`}</div><div class="profile-body"><div class="profile-title"><h2>${escapeHtml(p.display_name)}, ${p.age}</h2><span class="intent-pill">${escapeHtml(tr(p.relationship_goal||'Dating intentionally'))}</span></div><p class="location">${escapeHtml([p.city,p.country].filter(Boolean).join(', '))}</p><p class="profile-bio">${escapeHtml(p.bio||'Getting to know people with intention.')}</p>${interests.length?`<div>${interests.map(x=>`<span class="interest-pill">${escapeHtml(tr(x))}</span>`).join('')}</div>`:''}<div class="profile-meta"><div class="meta-box"><small>Languages</small><b>${escapeHtml(p.languages?splitTags(p.languages).map(tr).join(', '):tr('Not listed'))}</b></div><div class="meta-box"><small>Occupation</small><b>${escapeHtml(p.occupation||'Not listed')}</b></div></div><div class="card-actions"><button class="round-action" data-card-action="safety" title="Safety options">•••</button><button class="secondary-btn" data-card-action="pass">Pass</button><button class="primary-btn" data-card-action="like">Like ♥</button></div></div>`;
  card.classList.remove('hidden');applyLanguage();
}

async function likeCurrent(){const p=currentProfile();if(!p)return;try{const result=await api(`/api/like/${p.id}`,{method:'POST'});nextProfile();if(result.matched){await loadMatches();$('#matchModalText').textContent=`You and ${result.person?.display_name||'your match'} both chose each other.`;$('#matchMessageBtn').dataset.matchId=result.matchId;$('#matchModal').classList.remove('hidden');}else toast('Like sent ✓');}catch(e){toast(e.message,'error');}}
async function passCurrent(){const p=currentProfile();if(!p)return;try{await api(`/api/pass/${p.id}`,{method:'POST'});nextProfile();}catch(e){toast(e.message,'error');}}

async function loadMatches(){try{state.matches=await api('/api/matches');if(state.activeMatch&&!state.matches.some(m=>Number(m.match_id)===Number(state.activeMatch.match_id)))state.activeMatch=null;renderMatches();renderConversationList();if(!state.activeMatch)resetChatEmptyState();updateMatchBadge();applyLanguage();}catch(e){toast(e.message,'error');}}
async function updateNotifications(){try{const n=await api('/api/notifications');const mb=$('#matchBadge'),msg=$('#messageBadge');mb.textContent=n.new_matches||0;mb.classList.toggle('hidden',!(n.new_matches>0));msg.textContent=n.unread_messages||0;msg.classList.toggle('hidden',!(n.unread_messages>0));}catch{}}
function updateMatchBadge(){updateNotifications();}
function renderMatches(){const grid=$('#matchesGrid');if(!state.matches.length){grid.innerHTML=`<div class="state-card"><div class="state-icon">♡</div><h3>No matches yet</h3><p>When someone you like chooses you back, they'll appear here.</p><button class="primary-btn" data-go-discover>Discover people</button></div>`;applyLanguage();return;}grid.innerHTML=state.matches.map(m=>`<article class="match-card"><div class="match-photo">${m.photo_url?`<img src="${escapeHtml(m.photo_url)}" alt="${escapeHtml(m.display_name)}" loading="lazy">`:escapeHtml(initials(m.display_name))}</div><div class="match-body"><div class="match-name-row"><h3>${escapeHtml(m.display_name)}</h3>${m.unread_count?`<span class="match-unread">${m.unread_count}</span>`:''}</div><small class="match-location">${escapeHtml([m.city,m.country].filter(Boolean).join(', '))}</small><p class="match-preview">${escapeHtml(m.last_message||'You matched — say hello.')}</p><div class="match-actions"><button class="primary-btn" data-chat="${m.match_id}">Message</button><button class="secondary-btn match-more" aria-label="Safety" data-match-safety="${m.id}">•••</button></div></div></article>`).join('');applyLanguage();}
function resetChatEmptyState(){const header=$('#chatHeader'),box=$('#chatMessages'),form=$('#chatForm');if(header)header.innerHTML=`<div><h3>${tr('Select a match')}</h3><p>${tr('Your messages stay between you and your match.')}</p></div>`;if(box)box.innerHTML=`<div class="chat-empty"><span>♡</span><p>${tr('Choose a conversation to start chatting.')}</p></div>`;form?.classList.add('hidden');}
function renderConversationList(){const list=$('#conversationList');if(!state.matches.length){list.innerHTML=`<div class="state-card conversation-empty"><p>No conversations yet.</p></div>`;state.activeMatch=null;resetChatEmptyState();applyLanguage();return;}list.innerHTML=state.matches.map(m=>`<button class="conversation-item ${state.activeMatch?.match_id===m.match_id?'active':''}" data-chat="${m.match_id}"><span class="conversation-avatar">${m.photo_url?`<img src="${escapeHtml(m.photo_url)}" alt="">`:escapeHtml(initials(m.display_name))}</span><span class="conversation-copy"><b>${escapeHtml(m.display_name)}</b><span>${escapeHtml(m.last_message||'You matched')}</span></span>${m.unread_count?`<span class="unread-dot">${m.unread_count}</span>`:`<small>${timeLabel(m.last_message_at)}</small>`}</button>`).join('');}

async function openChat(matchId){const match=state.matches.find(m=>Number(m.match_id)===Number(matchId));if(!match)return;state.activeMatch=match;showScreen('chat');$('.chat-shell').classList.add('chat-open');$('#chatForm').classList.remove('hidden');renderConversationList();$('#chatHeader').innerHTML=`<div><h3>${escapeHtml(match.display_name)}</h3><p>${escapeHtml([match.city,match.country].filter(Boolean).join(', '))}</p></div><div class="chat-tools"><button class="secondary-btn" data-chat-safety="${match.id}">Safety</button><button class="secondary-btn" data-unmatch="${match.match_id}">Unmatch</button></div>`;await loadMessages();await loadMatches();}
async function loadMessages(){if(!state.activeMatch)return;try{const messages=await api(`/api/messages/${state.activeMatch.match_id}`),box=$('#chatMessages');box.innerHTML=messages.length?messages.map(msg=>`<div class="message-row ${Number(msg.sender_id)===Number(state.me.id)?'mine':''}"><div class="message-bubble">${escapeHtml(msg.body)}<small>${new Date(msg.created_at).toLocaleTimeString(uiLang(),{hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join(''):`<div class="chat-empty"><span>♡</span><p>You matched. Start with something genuine.</p></div>`;box.scrollTop=box.scrollHeight;await updateNotifications();}catch(e){toast(e.message,'error');}}

function openSafety(personId,name='this person'){state.safetyTarget=Number(personId);$('#safetyTitle').textContent=uiLang()==='vi'?`Tùy chọn an toàn cho ${name}`:`${tr('Safety options for')} ${name}`;$('#reportReason').value='';$('#safetyModal').classList.remove('hidden');}
function closeModals(){$$('.modal').forEach(m=>m.classList.add('hidden'));}


function startPolling() {
  clearInterval(state.pollTimer);
  if (!state.me) return;
  state.pollTimer = setInterval(async () => {
    if (!state.me) return;
    try {
      await loadMatches();
      await updateNotifications();
      if (state.screen === 'chat' && state.activeMatch) await loadMessages();
    } catch {}
  }, 8000);
}
function stopPolling() { clearInterval(state.pollTimer); state.pollTimer=null; }

const legalCopy={
  safety:{title:'Safety',body:`<p>Your safety comes first. Keep early conversations on VOWSI, never send money or financial information, and meet in a public place when you decide to meet offline.</p><p>Use Report or Block whenever a profile or conversation feels suspicious, abusive or unsafe. If you are in immediate danger, contact local emergency services.</p>`},
  privacy:{title:'Privacy',body:`<p>VOWSI uses the information you provide to operate your account, show your profile to compatible members, support matching and messaging, and help keep the service safe.</p><p>Do not post private information in your bio that you would not want other members to see. You can pause Discover or delete your account from Settings.</p>`},
  terms:{title:'Terms',body:`<p>VOWSI is for adults age 18 and older. By using VOWSI, you agree to provide accurate account information, respect other members, and use the service lawfully. Harassment, impersonation, fraud, spam, solicitation, scams and harmful or illegal content are prohibited.</p><p>VOWSI may restrict or remove accounts that violate these rules. Commercial launch terms, billing terms and jurisdiction-specific notices will be published before paid features are activated.</p>`},
  community:{title:'Community Guidelines',body:`<p>Be genuine, respectful and safe. Do not impersonate others, solicit money, threaten or harass people, post sexual or violent content without consent, or use VOWSI for scams or spam.</p><p>Members can report or block behavior that violates these guidelines.</p>`}
};
function openLegal(key){const item=legalCopy[key];if(!item)return;$('#legalTitle').textContent=item.title;$('#legalBody').innerHTML=item.body;$('#legalModal').classList.remove('hidden');}

function showProfileReady(){const el=$('#profileReady');el.classList.remove('hidden');setTimeout(()=>el.classList.add('hidden'),900);}

$('[data-action="home"]').addEventListener('click',()=>state.me?(state.me.profile_completed?showScreen('discover'):startOnboarding()):showScreen('landing'));
$('#signInTop').addEventListener('click',()=>setAuthMode('login'));
$('#joinTop').addEventListener('click',()=>setAuthMode('signup'));
$('#heroJoin').addEventListener('click',()=>setAuthMode('signup'));
$('#heroSignIn').addEventListener('click',()=>setAuthMode('login'));
$('#signupTab').addEventListener('click',()=>setAuthMode('signup'));
$('#loginTab').addEventListener('click',()=>setAuthMode('login'));

$('#signupForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!validateSignup())return;
  const form=e.currentTarget,button=$('button[type="submit"]',form),payload=formPayload(form);payload.acceptedTerms=form.elements.acceptedTerms.checked;
  button.disabled=true;button.textContent='Creating account…';
  try{
    const result=await api('/api/signup',{method:'POST',body:JSON.stringify(payload)});
    const email=result.email||payload.email;
    form.reset(); setAuthMode('login','✓ Account created successfully. Sign in to continue.');
    $('#loginForm').elements.email.value=email; $('#loginForm').elements.password.focus();
  }catch(err){
    const errBox=$('#authNotice');errBox.textContent=err.message;errBox.className='inline-notice error';
  }finally{button.disabled=false;button.textContent='Create account';}
});

$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!validateLogin())return;
  const form=e.currentTarget,button=$('button[type="submit"]',form);button.disabled=true;button.textContent='Signing in…';
  try{const result=await api('/api/login',{method:'POST',body:JSON.stringify(formPayload(form))});state.me=result.user||await api('/api/me');hydrateForms(state.me);startPolling();toast('Welcome back ✓');if(result.next==='onboarding'||!state.me.profile_completed)startOnboarding();else{showScreen('discover');await Promise.all([loadDiscover(),loadMatches()]);}}
  catch(err){const box=$('#loginError');box.textContent=err.message;box.classList.remove('hidden');}
  finally{button.disabled=false;button.textContent='Sign in';}
});

$('#logoutBtn').addEventListener('click',async()=>{try{await api('/api/logout',{method:'POST'});}catch{}stopPolling();state.me=null;state.activeMatch=null;state.matches=[];showScreen('landing');toast('Signed out.');});

$$('.nav-item').forEach(btn=>btn.addEventListener('click',async()=>{const name=btn.dataset.screen;showScreen(name);if(name==='discover')await loadDiscover();if(name==='matches'){await loadMatches();await api('/api/matches/seen',{method:'POST'});await updateNotifications();}if(name==='chat'){await loadMatches();renderConversationList();}if(name==='profile'){state.me=await api('/api/me');hydrateForms(state.me);}}));
$('#accountChip').addEventListener('click',async()=>{showScreen('profile');state.me=await api('/api/me');hydrateForms(state.me);});

$('#onboardingNext').addEventListener('click',()=>{if(!validateOnboardingStep(state.onboardingStep))return;captureOnboardingDraft();state.onboardingStep=Math.min(3,state.onboardingStep+1);updateOnboarding();restoreOnboardingDraft();});
$('#onboardingBack').addEventListener('click',()=>{captureOnboardingDraft();state.onboardingStep=Math.max(1,state.onboardingStep-1);updateOnboarding();restoreOnboardingDraft();});
$('#onboardingForm').addEventListener('submit',async e=>{e.preventDefault();if(!validateOnboardingStep(3))return;const button=$('#onboardingSave');button.disabled=true;button.textContent='Finishing…';try{await saveOnboarding();showProfileReady();setTimeout(async()=>{showScreen('discover');await Promise.all([loadDiscover(),loadMatches()]);},650);}catch(err){if(err.field==='displayName'){state.onboardingStep=1;updateOnboarding();fieldError(e.currentTarget,'displayName',err.message);}else if(err.field==='country'){state.onboardingStep=1;updateOnboarding();fieldError(e.currentTarget,'country',err.message);}else if(err.field==='relationshipGoal'){state.onboardingStep=2;updateOnboarding();fieldError(e.currentTarget,'relationshipGoal',err.message);}else if(err.field==='photos'){state.onboardingStep=3;updateOnboarding();const el=document.querySelector('[data-error-for="photos"]');el.textContent=err.message;el.classList.add('show');}else if(err.field==='bio'){state.onboardingStep=3;updateOnboarding();fieldError(e.currentTarget,'bio',err.message);}else toast(err.message,'error',4000);}finally{button.disabled=false;button.textContent='Finish profile';}});

$('#onboardingPhotoInput').addEventListener('change',e=>uploadFiles(e.target.files));
$('#profilePhotoInput').addEventListener('change',e=>uploadFiles(e.target.files));
document.addEventListener('change',e=>{if(e.target.matches('[data-inline-photo]'))uploadFiles(e.target.files);});
document.addEventListener('click',e=>{const del=e.target.closest('[data-photo-delete]');if(del)deletePhoto(del.dataset.photoDelete);const first=e.target.closest('[data-photo-first]');if(first)makePhotoFirst(first.dataset.photoFirst);const lang=e.target.closest('[data-language]');if(lang)toggleCsvField(lang.dataset.form||'onboardingForm','languages',lang.dataset.language,6);const interest=e.target.closest('[data-interest]');if(interest)toggleCsvField(interest.dataset.form||'onboardingForm','interests',interest.dataset.interest,10);const legal=e.target.closest('[data-legal]');if(legal)openLegal(legal.dataset.legal);});

$('#filterForm').addEventListener('submit',e=>{e.preventDefault();loadDiscover();});
$('#resetFilters').addEventListener('click',()=>{$('#filterForm').reset();$('#filterForm').elements.minAge.value=18;$('#filterForm').elements.maxAge.value=99;loadDiscover();});
$('#profileCard').addEventListener('click',e=>{const action=e.target.closest('[data-card-action]')?.dataset.cardAction;if(!action)return;if(action==='like')likeCurrent();if(action==='pass')passCurrent();if(action==='safety'){const p=currentProfile();if(p)openSafety(p.id,p.display_name);}});

document.addEventListener('click',async e=>{
  const chat=e.target.closest('[data-chat]');if(chat)return openChat(chat.dataset.chat);
  if(e.target.closest('[data-go-discover]')){showScreen('discover');return loadDiscover();}
  const safety=e.target.closest('[data-match-safety]');if(safety){const m=state.matches.find(x=>Number(x.id)===Number(safety.dataset.matchSafety));if(m)openSafety(m.id,m.display_name);}
  const chatSafety=e.target.closest('[data-chat-safety]');if(chatSafety&&state.activeMatch)openSafety(state.activeMatch.id,state.activeMatch.display_name);
  const unmatch=e.target.closest('[data-unmatch]');if(unmatch){if(!confirm('Unmatch this person? The conversation will be removed.'))return;try{await api(`/api/matches/${unmatch.dataset.unmatch}`,{method:'DELETE'});state.activeMatch=null;resetChatEmptyState();toast('Unmatched.');showScreen('matches');await loadMatches();}catch(err){toast(err.message,'error');}}
  if(e.target.matches('[data-close-modal], .modal'))closeModals();
});

$('#chatBack').addEventListener('click',()=>{$('.chat-shell').classList.remove('chat-open');showScreen('matches');});
$('#chatForm').addEventListener('submit',async e=>{e.preventDefault();if(!state.activeMatch)return toast('Choose a conversation first.','error');const input=$('#chatInput'),body=input.value.trim();if(!body)return;input.value='';try{await api(`/api/messages/${state.activeMatch.match_id}`,{method:'POST',body:JSON.stringify({body})});await loadMessages();await loadMatches();}catch(err){input.value=body;toast(err.message,'error');}});

$('#profileForm').addEventListener('submit',async e=>{e.preventDefault();clearErrors(e.currentTarget);const p=formPayload(e.currentTarget);let ok=true;if(!p.displayName)ok=fieldError(e.currentTarget,'displayName','Add your display name.','profileDisplayName')&&ok;if(!p.country)ok=fieldError(e.currentTarget,'country','Choose your country.','profileCountry')&&ok;else if(!isCountry(p.country))ok=fieldError(e.currentTarget,'country','Choose a country from the list.','profileCountry')&&ok;if(!['Woman','Man'].includes(p.gender))ok=fieldError(e.currentTarget,'gender','Choose Woman or Man.')&&ok;if(!p.relationshipGoal)ok=fieldError(e.currentTarget,'relationshipGoal','Choose a relationship goal.','profileRelationshipGoal')&&ok;if(!p.bio)ok=fieldError(e.currentTarget,'bio','Write a short bio.','profileBio')&&ok;if(!(state.me?.photos?.length||state.me?.photo_url)){const el=document.querySelector('[data-error-for="profilePhotos"]');el.textContent='Add at least one photo.';el.classList.add('show');ok=false;}if(!ok)return;try{const saved=await api('/api/profile',{method:'PUT',body:JSON.stringify(p)});state.me=saved;hydrateForms(saved);toast('Profile saved ✓');}catch(err){toast(err.message,'error',4000);}});

$('#discoveryToggle').addEventListener('change',async e=>{try{await api('/api/settings/discovery',{method:'PUT',body:JSON.stringify({enabled:e.target.checked})});state.me.discovery_enabled=e.target.checked;toast(e.target.checked?'You are visible in Discover.':'Discovery paused.');}catch(err){e.target.checked=!e.target.checked;toast(err.message,'error');}});
$('#passwordForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,b=$('button[type="submit"]',f);b.disabled=true;try{await api('/api/password',{method:'PUT',body:JSON.stringify(formPayload(f))});f.reset();stopPolling();state.me=null;state.matches=[];state.activeMatch=null;setAuthMode('login','✓ Password updated. Please sign in again.');}catch(err){toast(err.message,'error',4000);}finally{b.disabled=false;}});
$('#deleteAccountBtn').addEventListener('click',async()=>{if(!confirm('Delete your VOWSI account permanently? This cannot be undone.'))return;if(!confirm('Final confirmation: delete all profile, match and message data?'))return;try{await api('/api/account',{method:'DELETE'});stopPolling();state.me=null;showScreen('landing');toast('Account deleted.');}catch(err){toast(err.message,'error');}});

$('#reportBtn').addEventListener('click',async()=>{if(!state.safetyTarget)return;const reason=$('#reportReason').value.trim();if(!reason)return toast('Choose a report reason.','error');try{await api(`/api/report/${state.safetyTarget}`,{method:'POST',body:JSON.stringify({reason})});closeModals();toast('Report submitted. Thank you.');}catch(err){toast(err.message,'error');}});
$('#blockBtn').addEventListener('click',async()=>{if(!state.safetyTarget)return;if(!confirm('Block this person? They will no longer appear to you.'))return;try{await api(`/api/block/${state.safetyTarget}`,{method:'POST'});closeModals();toast('Person blocked.');if(state.screen==='discover')loadDiscover();else{showScreen('matches');loadMatches();}}catch(err){toast(err.message,'error');}});
$('#matchMessageBtn').addEventListener('click',async e=>{const id=e.currentTarget.dataset.matchId;closeModals();await loadMatches();openChat(id);});


document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-password-toggle]'); if(!btn)return;
  const input=btn.closest('.password-input-wrap')?.querySelector('input'); if(!input)return;
  const showing=input.type==='text'; input.type=showing?'password':'text';
  btn.textContent=showing?'👁':'🙈'; btn.setAttribute('aria-label',showing?'Show password':'Hide password'); btn.title=showing?'Show password':'Hide password';
});

const initialUiLang=detectLanguage();applyLanguage(initialUiLang);$('#uiLanguage')?.addEventListener('change',e=>{localStorage.setItem('vowsi_ui_language',e.target.value);applyLanguage(e.target.value);renderChoiceChips();syncChoiceChips();});initCountries(); renderChoiceChips(); initHeroSlideshow();
bootstrap();

for(const form of [$('#onboardingForm'),$('#profileForm')]){form?.elements.country?.addEventListener('change',e=>updateCityList(e.target.value,form.elements.city?.value));form?.elements.country?.addEventListener('input',e=>updateCityList(e.target.value,form.elements.city?.value));form?.elements.city?.addEventListener('input',()=>scheduleCitySearch(form));}
