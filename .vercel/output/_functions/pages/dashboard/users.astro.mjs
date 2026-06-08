/* empty css                                    */
import { e as createComponent, p as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/utils_DY3iklJy.mjs';
import { $ as $$Header, a as $$Sidebar } from '../../chunks/Header_CSh91x7o.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BGa3uP_K.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../chunks/table_BNtKfnwL.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from '../../chunks/card_BjP27i0i.mjs';
import { B as Button } from '../../chunks/button_D3TXvS4A.mjs';
import { I as Input } from '../../chunks/input_VyVQ34R2.mjs';
import { F as FetchData, A as API_ENDPOINTS, B as Badge } from '../../chunks/api_CUvdBGU1.mjs';
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from '../../chunks/alert-dialog_D0p8C7NC.mjs';
import { UserPlus, Search, CheckCircle2, AlertCircle, Key, Settings, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from '../../chunks/dialog_C_p9J4uV.mjs';
import { L as Label } from '../../chunks/label_BcFE407i.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from '../../chunks/select_B_QFL7NP.mjs';
import { A as AuthGuard } from '../../chunks/AuthGuard_By6cWR9G.mjs';
export { renderers } from '../../renderers.mjs';

const CreateUserDialog = ({ onUserCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "viewer"
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await FetchData(API_ENDPOINTS.USERS.CREATE, "POST", {
        body: formData
      });
      setOpen(false);
      setFormData({ nombre: "", email: "", password: "", rol: "viewer" });
      onUserCreated();
    } catch (err) {
      setError(err.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
      /* @__PURE__ */ jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
      " Nuevo Usuario"
    ] }) }),
    /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Nuevo Usuario" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Ingrese los datos del nuevo usuario." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "nombre", className: "text-right", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "nombre",
              value: formData.nombre,
              onChange: (e) => setFormData({ ...formData, nombre: e.target.value }),
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-right", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-right", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              value: formData.password,
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              className: "col-span-3",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "rol", className: "text-right", children: "Rol" }),
          /* @__PURE__ */ jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsxs(
            "select",
            {
              id: "rol",
              value: formData.rol,
              onChange: (e) => setFormData({ ...formData, rol: e.target.value }),
              className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx("option", { value: "viewer", children: "Viewer" }),
                /* @__PURE__ */ jsx("option", { value: "vendedor", children: "Vendedor" }),
                /* @__PURE__ */ jsx("option", { value: "manager", children: "Manager" }),
                /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
              ]
            }
          ) })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm text-center", children: error })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Creando..." : "Crear Usuario" }) })
    ] }) })
  ] });
};

const ChangePasswordDialog = ({ open, onClose, user }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      await FetchData(API_ENDPOINTS.USERS.UPDATE(user.id_usuario, "password"), "PATCH", {
        body: { password }
      });
      onClose();
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Error actualizando password");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (val) => !val && onClose(), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Cambiar Contraseña" }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Ingrese la nueva contraseña para el usuario ",
        /* @__PURE__ */ jsx("strong", { children: user?.nombre }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "new-password", className: "text-right", children: "Nueva" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "new-password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "col-span-3",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "confirm-password", className: "text-right", children: "Confirmar" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirm-password",
            type: "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: "col-span-3",
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm text-center", children: error })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: loading, children: "Cancelar" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Guardando..." : "Guardar Cambios" })
    ] })
  ] }) }) });
};

const AVAILABLE_ROLES = [
  { id: "viewer", label: "Viewer" },
  { id: "vendedor", label: "Vendedor" },
  { id: "manager", label: "Manager" },
  { id: "admin", label: "Admin" }
];
const EditRoleDialog = ({ open, onClose, onUserUpdated, user }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user && user.roles && user.roles.length > 0) {
      setSelectedRole(user.roles[0]);
    } else {
      setSelectedRole("viewer");
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      await FetchData(API_ENDPOINTS.USERS.UPDATE(user.id_usuario, "roles"), "PATCH", {
        body: { roles: [selectedRole] }
      });
      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Error actualizando roles");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (val) => !val && onClose(), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Roles" }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Seleccione el rol para el usuario ",
        /* @__PURE__ */ jsx("strong", { children: user?.nombre }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "role-select", children: "Rol asignado" }),
        /* @__PURE__ */ jsxs(Select, { value: selectedRole, onValueChange: setSelectedRole, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { id: "role-select", className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccione un rol" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: AVAILABLE_ROLES.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: role.id, children: role.label }, role.id)) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm text-center", children: error })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: loading, children: "Cancelar" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Guardando..." : "Guardar Cambios" })
    ] })
  ] }) }) });
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5e3);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const handleHardDelete = async () => {
    if (!userToDelete) return;
    setStatusLoading(true);
    try {
      await FetchData(API_ENDPOINTS.USERS.DELETE(userToDelete.id_usuario), "DELETE");
      setMessage({ type: "success", text: "Usuario eliminado permanentemente." });
      await fetchUsers();
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({
        type: "error",
        text: error.message || "No se pudo eliminar el usuario. Puede que tenga registros asociados."
      });
    } finally {
      setStatusLoading(false);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      if (searchTerm) queryParams.append("search", searchTerm);
      const url = `${API_ENDPOINTS.USERS.LIST}?${queryParams.toString()}`;
      const data = await FetchData(url);
      if (data && Array.isArray(data.data)) {
        setUsers(data.data);
        setTotalPages(Math.ceil(data.total / data.limit) || 1);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1 && searchTerm !== "") {
        setPage(1);
      } else {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  useEffect(() => {
    fetchUsers();
  }, [page]);
  const handleToggleStatus = async () => {
    if (!userToToggleStatus) return;
    setStatusLoading(true);
    try {
      await FetchData(API_ENDPOINTS.USERS.UPDATE(userToToggleStatus.id_usuario, "status"), "PATCH", {
        body: { activo: !userToToggleStatus.activo }
      });
      await fetchUsers();
      setUserToToggleStatus(null);
    } catch (error) {
      console.error("Error toggling user status:", error);
    } finally {
      setStatusLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar usuarios...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-9 w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(CreateUserDialog, { onUserCreated: fetchUsers }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "py-4 flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Usuarios del Sistema" }),
        message && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full border animate-in fade-in slide-in-from-right-1 ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`, children: [
          message.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: message.text })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-0 sm:p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Email" }),
            /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Rol" }),
            /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right whitespace-nowrap", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center h-24 text-muted-foreground", children: "Cargando usuarios..." }) }) : users.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center h-24 text-muted-foreground", children: "No se encontraron usuarios." }) }) : users.map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium whitespace-nowrap", children: user.nombre }),
            /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: user.email }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize whitespace-nowrap", children: user.roles && user.roles.length > 0 ? user.roles.join(", ") : "viewer" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: user.activo ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-500 hover:bg-green-600", children: "Activo" }) : /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Inactivo" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8",
                  title: "Cambiar Password",
                  onClick: () => setSelectedUserForPassword(user),
                  children: /* @__PURE__ */ jsx(Key, { className: "h-4 w-4 text-muted-foreground" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8",
                  title: "Editar Rol",
                  onClick: () => setSelectedUserForRole(user),
                  children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4 text-muted-foreground" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8",
                  title: user.activo ? "Desactivar" : "Activar",
                  onClick: () => setUserToToggleStatus(user),
                  children: user.activo ? /* @__PURE__ */ jsx(Ban, { className: "h-4 w-4 text-red-500" }) : /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8",
                  title: "Eliminar permanentemente",
                  onClick: () => setUserToDelete(user),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" })
                }
              )
            ] }) })
          ] }, user.id_usuario)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 py-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page === 1 || loading,
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
                "Anterior"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Página ",
            page,
            " de ",
            totalPages || 1
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
              disabled: page >= totalPages || loading,
              children: [
                "Siguiente",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ChangePasswordDialog,
      {
        open: !!selectedUserForPassword,
        onClose: () => setSelectedUserForPassword(null),
        user: selectedUserForPassword
      }
    ),
    /* @__PURE__ */ jsx(
      EditRoleDialog,
      {
        open: !!selectedUserForRole,
        onClose: () => setSelectedUserForRole(null),
        onUserUpdated: fetchUsers,
        user: selectedUserForRole
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!userToToggleStatus, onOpenChange: () => setUserToToggleStatus(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: userToToggleStatus?.activo ? "¿Desactivar usuario?" : "¿Activar usuario?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "¿Estás seguro que deseas ",
          userToToggleStatus?.activo ? "desactivar" : "activar",
          " al usuario ",
          /* @__PURE__ */ jsx("strong", { children: userToToggleStatus?.nombre }),
          "?",
          userToToggleStatus?.activo && " El usuario no podrá acceder al sistema."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleToggleStatus, disabled: statusLoading, className: userToToggleStatus?.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700", children: statusLoading ? "Procesando..." : userToToggleStatus?.activo ? "Desactivar" : "Activar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!userToDelete, onOpenChange: (val) => !val && setUserToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar usuario de forma permanente?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción eliminará al usuario ",
          /* @__PURE__ */ jsx("strong", { children: userToDelete?.nombre }),
          " del sistema. Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleHardDelete, disabled: statusLoading, className: "bg-red-600 hover:bg-red-700", children: statusLoading ? "Eliminando..." : "Eliminar permanentemente" })
      ] })
    ] }) })
  ] });
};

const $$Users = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Usuarios - Panel Administrativo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col min-h-screen bg-background bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"> ${renderComponent($$result2, "Header", $$Header, {})} <div class="flex flex-1"> ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} <main class="flex-1 p-4 md:p-8 overflow-x-hidden"> ${renderComponent($$result2, "AuthGuard", AuthGuard, { "client:load": true, "allowedRoles": ["admin", "manager"], "panelName": "Usuarios", "client:component-hydration": "load", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/AuthGuard", "client:component-export": "AuthGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "UserList", UserList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Users/UserList", "client:component-export": "UserList" })} ` })} </main> </div> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/users.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/users.astro";
const $$url = "/dashboard/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
