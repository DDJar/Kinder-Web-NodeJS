import { DashboardLayout, DefaultLayout } from '~/layout';
import Home from '~/pages/Home';
import { Error404, Unauthorized } from '~/pages/Error';
import { Login, NotificationMail, ResetPassWords, Register } from '~/pages/Auth';
import { Profile, AccountSecurity } from '~/pages/Profile';
import {
    ChildrenDetail,
    ChildrenProfile,
    AddChild,
    ChildProgress,
    TeacherInClassAndSkill,
} from '~/pages/Profile/Children';
import { TeacherDetail, TeacherProfile } from '~/pages/Profile/Teacher';
import AuthLayout from '~/layout/AuthLayout';
import Payment from '~/pages/Payment';
import Proposal from '~/pages/Proposal';
import CameraSetupPage from '~/components/Header/CameraSetupPage';
import Annoucement from '~/pages/Annoucement';
import DetailAnnouce from '~/pages/Annoucement/detail';
import CreateAnnoucement from '~/pages/Annoucement/createAnn';
import Skilles from '~/pages/Academy/Skilles';
import CreateProposal from '~/pages/Proposal/createproposal';
import DetailProposal from '~/pages/Proposal/detail';
import ModalTemplate from '~/pages/templates/Modal';
import ToastTemplate from '~/pages/templates/Toast';
import PopoverCompTemplate from '~/pages/templates/PopoverComp';
import FormLayout from '~/pages/templates/Form/FormLayout';
import CreateUser from '~/pages/Dashboard/CreateUser';
import ManagerSalary from '~/pages/Salary/salaryManager';
import CommentChild from '~/pages/Comment_Child';
import Academy from '~/pages/Dashboard/Academy';
import CreateAcademy from '~/pages/Dashboard/Academy/Create';
import UserPage from '~/pages/Dashboard/User';
import SendLinkMail from '~/pages/Auth/SendEmail';
import SchedulePage from '~/pages/Schedule';
import TuitionFee from '~/pages/TuitionFee';
import PersonalSalary from '~/pages/Salary';
import AttendancePage from '~/pages/AttendancePage';
import UpdateProposal from '~/pages/Proposal/update';
import RegisterAcademy from '~/pages/Dashboard/Academy/RegisterAcademy';
import ClassList from '~/pages/Employee/myClass';
import ProcessRegister from '~/pages/Dashboard/Academy/ProcessRegister';
import ViewDetailClass from '~/pages/Dashboard/Academy/ViewDetailClass';
import ArrangeClasses from '~/pages/Dashboard/Academy/ArrangeClasses';
import HistoryPayment from '~/pages/Payment/HistoryPayment';
import PaymentManagement from '~/pages/Payment/PaymentManagement';
import RegisterTransport from '~/pages/Service/RegisterTransport';
import AllTransport from '~/pages/Dashboard/Transportation/ProcessTransport';
import HistoryRegister from '~/pages/Service/HistoryRegister';
import SkillList from '~/pages/Employee/mySkill';
import ClassDetails from '~/pages/Employee/childClass';
import SkillDetails from '~/pages/Employee/childSkill';
import ButtonTemplate from '~/pages/templates/Button';
import RegisterSchool from '~/pages/Profile/Children/RegisterSchool';
import CreateTransportation from '~/pages/Dashboard/Transportation/Create';
import TransportationService from '~/pages/Dashboard/Transportation/TransportationService';
import ArrangeTransportation from '~/pages/Dashboard/Transportation/ArrangeTransportation';
import MyTransportationService from '~/pages/Dashboard/Driver/myTransportation';
import TransportationDetails from '~/pages/Dashboard/Driver/childTransportation';
import ViewDetailTransportation from '~/pages/Dashboard/Transportation/ViewDetailTransportation';
import CommonDashboard from '~/pages/Dashboard/CommonDashboard';
import Transactions from '~/pages/TransactionManagement/Transactions';
import Feedback from '~/pages/Profile/Children/Feedback';
import FeedbackList from '~/pages/Dashboard/ViewFeedback';
import ViewApplication from '~/pages/Profile/Children/ViewApplication';
import CreateCurriculum from '~/pages/Academy/CreateCurriculum';
import { RoomList, CreateRoom } from '~/pages/Dashboard/Room';
import { Maps } from '~/pages/BusServices';
import DriverMap from '~/pages/Dashboard/Driver/DriverMap';
import BusServiceChildManagement from '~/pages/BusServices/BusServiceChildManagement';

const publicRoutes = [
    { path: '/*', component: Error404 },
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/camera-guide', component: CameraSetupPage },
    { path: '/profile/:id', component: Profile },
    { path: '/profile/children', component: ChildrenProfile },
    { path: '/children/:id/teacher', component: TeacherInClassAndSkill },
    { path: '/teachers/:id', component: TeacherDetail },
    { path: '/teachers', component: TeacherProfile },
    { path: '/children/:id', component: ChildrenDetail },
    { path: '/register-transport', component: RegisterTransport, allowedRoles: ['STAFF', 'USER'] },
    {
        path: '/dashboards/transportation/view-register-transport',
        component: AllTransport,
        layout: DashboardLayout,
        allowedRoles: ['STAFF'],
    },
    { path: '/view-application/:id', component: ViewApplication, allowedRoles: ['USER'] },
    { path: '/view-transport', component: HistoryRegister, allowedRoles: ['STAFF', 'USER'] },
    { path: '/children/:id/register', component: RegisterSchool, allowedRoles: ['USER'] },
    { path: '/add-child', component: AddChild },
    { path: '/child/:id/child-progress', component: ChildProgress },
    { path: '/account-security', component: AccountSecurity },
    { path: '/login', component: Login, layout: AuthLayout },
    { path: '/register', component: Register, layout: AuthLayout },
    {
        path: '/dashboards',
        component: CommonDashboard,
        layout: DashboardLayout,
        allowedRoles: ['ADMIN', 'STAFF', 'TEACHER', `DRIVER`, `ACCOUNTANT`],
    },
    { path: '/dashboards/users/view-list', component: UserPage, layout: DashboardLayout, allowedRoles: ['ADMIN'] },
    { path: '/dashboards/users/create', component: CreateUser, layout: DashboardLayout, allowedRoles: ['ADMIN'] },
    {
        path: '/dashboards/academy/view-list',
        component: Academy,
        layout: DashboardLayout,
        allowedRoles: ['STAFF', 'ADMIN'],
    },

    {
        path: '/dashboards/academy/create',
        component: CreateAcademy,
        layout: DashboardLayout,
        allowedRoles: ['STAFF'],
    },
    {
        path: '/dashboards/academy/create-curriculum',
        component: CreateCurriculum,
        layout: DashboardLayout,
        allowedRoles: ['STAFF'],
    },
    {
        path: '/update',
        component: UpdateProposal,
        allowedRoles: ['ADMIN'],
    },

    { path: '/create', component: CreateProposal },
    { path: '/proposal', component: Proposal },
    { path: '/annouce', component: Annoucement },
    { path: '/annouce/:id', component: DetailAnnouce },
    { path: '/createAnn', component: CreateAnnoucement },
    { path: '/users/:userId/feedback', component: Feedback },

    { path: '/proposals/:id', component: DetailProposal },
    { path: '/academy/', component: Skilles, layout: DefaultLayout },
    {
        path: '/academy/skilles',
        component: Skilles,
        layout: DefaultLayout,
        allowedRoles: ['ADMIN', 'TEACHER', 'STAFF', 'USER'],
    },
    { path: '/persalary', component: PersonalSalary },
    { path: '/manasalary', component: ManagerSalary },

    { path: '/comment-child', component: CommentChild, layout: DefaultLayout },
    { path: '/attendance', component: AttendancePage, layout: DefaultLayout },
    { path: '/unauthorized', component: Unauthorized, layout: DefaultLayout },
    { path: '/forgot-password', component: SendLinkMail, layout: AuthLayout },
    { path: '/verify-notification', component: NotificationMail, layout: AuthLayout },
    { path: '/reset-password/:id', component: ResetPassWords, layout: AuthLayout },
    { path: '/schedule', component: SchedulePage, layout: DefaultLayout },
    { path: '/tuitionfee', component: TuitionFee, layout: DefaultLayout },
    { path: 'dashboards/my-class', component: ClassList, layout: DashboardLayout, allowedRoles: ['ADMIN', 'TEACHER'] },
    { path: 'dashboards/my-skill', component: SkillList, layout: DashboardLayout, allowedRoles: ['ADMIN', 'TEACHER'] },
    {
        path: 'dashboards/my-class/:classId',
        component: ClassDetails,
        layout: DashboardLayout,
        allowedRoles: ['ADMIN', 'TEACHER'],
    },
    {
        path: 'dashboards/my-skill/:skillId',
        component: SkillDetails,
        layout: DashboardLayout,
        allowedRoles: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/dashboards/view-feedback',
        component: FeedbackList,
        layout: DashboardLayout,
        allowedRoles: ['ADMIN', 'STAFF'],
    },
    // { path: '/classList', component: ClassList, layout: DefaultLayout, allowedRoles: ['ADMIN', 'TEACHER'] },
    // {
    //     path: '/classList',
    //     component: RegisterAcademy,
    //     layout: DashboardLayout,
    // },
    {
        path: '/dashboards/academy/registed-academy',
        component: RegisterAcademy,
        layout: DashboardLayout,
        allowedRoles: ['ADMIN', 'TEACHER', 'ACCOUNTANT', 'STAFF'],
    },
    { path: '/modals', component: ModalTemplate, layout: DefaultLayout },
    { path: '/buttons', component: ButtonTemplate, layout: DefaultLayout },
    { path: '/toasts', component: ToastTemplate, layout: DefaultLayout },
    { path: '/popovers', component: PopoverCompTemplate, layout: DefaultLayout },
    { path: '/dashboards/forms/form-layout', component: FormLayout, layout: DashboardLayout },
    {
        path: '/dashboards/academy/review-register-class-children',
        component: ProcessRegister,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: 'dashboards/transportation/view-list',
        component: TransportationService,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: 'dashboards/transportation/view-detail-transportation',
        component: ViewDetailTransportation,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: 'dashboards/transportation/create-transportation',
        component: CreateTransportation,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: 'dashboards/transportation/arrange-transportation',
        component: ArrangeTransportation,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: '/dashboards/academy/view-detail-academy',
        component: ViewDetailClass,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: 'dashboards/driver/transportation-by-driver',
        component: MyTransportationService,
        layout: DashboardLayout,
        allowedRoles: [`DRIVER`],
    },
    {
        path: 'dashboards/driver/transportation-detail-by-driver/:transportId',
        component: TransportationDetails,
        layout: DashboardLayout,
        allowedRoles: [`DRIVER`],
    },
    {
        path: '/dashboards/academy/arrange-academy',
        component: ArrangeClasses,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: '/dashboards/rooms/create-room',
        component: CreateRoom,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    {
        path: '/dashboards/rooms',
        component: RoomList,
        layout: DashboardLayout,
        allowedRoles: [`STAFF`],
    },
    { path: '/payment', component: PaymentManagement, allowedRoles: ['USER'] },
    { path: '/payment/detail', component: Payment, allowedRoles: ['USER'] },
    { path: '/payment/history', component: HistoryPayment, allowedRoles: ['USER'] },
    {
        path: '/dashboards/transactions',
        component: Transactions,
        layout: DashboardLayout,
        allowedRoles: ['ACCOUNTANT'],
    },
    { path: '/bus-services', component: BusServiceChildManagement, allowedRoles: ['USER'] },
    { path: '/bus-services/maps', component: Maps, allowedRoles: ['USER'] },
    { path: '/dashboards/bus-services/maps', component: DriverMap, allowedRoles: ['DRIVER'] },
];

export default publicRoutes;
