import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface Translations {
    [key: string]: {
        [K in Language]: string;
    };
}

export const translations: Translations = {
    // Common
    'back': { pt: 'Voltar', en: 'Back', es: 'Volver' },
    'help': { pt: 'Como se Inscrever?', en: 'How to register?', es: '¿Cómo inscribirse?' },
    'search_country': { pt: 'Pesquisar país ou código...', en: 'Search country or code...', es: 'Buscar país o código...' },
    'no_country_found': { pt: 'Nenhum país encontrado.', en: 'No country found.', es: 'No se encontró ningún país.' },
    'Administração': { pt: 'Administração', en: 'Admin', es: 'Administración' },
    'rights_reserved': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    'developed_by': { pt: 'Desenvolvido por', en: 'Developed by', es: 'Desarrollado por' },
    'complete_fields_to_register': { pt: 'PREENCHA TUDO PARA SE INSCREVER', en: 'COMPLETE ALL FIELDS TO REGISTER', es: 'COMPLETE TODO PARA REGISTRARSE' },
    'foreigner_question': { pt: 'Você é estrangeiro?', en: 'Are you a foreigner?', es: '¿Eres extranjero?' },
    'foreigner': { pt: 'Sou Estrangeiro', en: 'I am a Foreigner', es: 'Soy Extranjero' },
    'brazilian': { pt: 'Sou Brasileiro', en: 'I am Brazilian', es: 'Soy Brasileiro' },

    // Event List
    'hero_title': { pt: 'Eventos UNINASSAU', en: 'UNINASSAU Events', es: 'Eventos UNINASSAU' },
    'hero_subtitle': { pt: 'Confira a programação e confirme sua presença nos próximos eventos', en: 'Check out the schedule and confirm your presence in upcoming events', es: 'Consulta la programación y confirma tu presencia en los próximos eventos' },
    'hero_scroll_text': { pt: 'Role para baixo para ver os eventos ativos e realizar sua inscrição', en: 'Scroll down to see active events and register', es: 'Desplácese hacia abajo para ver los eventos activos e inscribirse' },
    'search_placeholder': { pt: 'Pesquisar eventos...', en: 'Search events...', es: 'Buscar eventos...' },
    'all_dates': { pt: 'Todas as Datas', en: 'All Dates', es: 'Todas las fechas' },
    'today': { pt: 'Hoje', en: 'Today', es: 'Hoy' },
    'next_7_days': { pt: 'Próximos 7 dias', en: 'Next 7 days', es: 'Próximos 7 días' },
    'next_30_days': { pt: 'Próximos 30 dias', en: 'Next 30 days', es: 'Próximos 30 días' },
    'all_locations': { pt: 'Todos os Locais', en: 'All Locations', es: 'Todos los locales' },
    'clear_filters': { pt: 'Limpar Filtros', en: 'Clear Filters', es: 'Limpiar Filtros' },
    'clear_all_filters': { pt: 'Limpar todos os filtros', en: 'Clear all filters', es: 'Limpiar todos los filtros' },
    'register_now': { pt: 'Inscreva-se', en: 'Register Now', es: 'Inscríbete ahora' },
    'no_events_found': { pt: 'Nenhum evento encontrado.', en: 'No events found.', es: 'No se encontraron eventos.' },
    'event_found': { pt: 'evento encontrado', en: 'event found', es: 'evento encontrado' },
    'events_found': { pt: 'eventos encontrados', en: 'events found', es: 'eventos encontrados' },
    'no_search_results': { pt: 'Nenhum evento corresponde aos filtros selecionados.', en: 'No events match the selected filters.', es: 'Ningún evento coincide com los filtros seleccionados.' },
    'no_events_available': { pt: 'Não há eventos disponíveis para inscrição no momento.', en: 'There are no events available for registration at the moment.', es: 'No hay eventos disponibles para registrarse en este momento.' },

    // Event Registration
    'confirm_presence': { pt: 'Confirmar Presença', en: 'Confirm Attendance', es: 'Confirmar Asistencia' },
    'full_name': { pt: 'Nome Completo', en: 'Full Name', es: 'Nombre Completo' },
    'phone': { pt: 'Telefone', en: 'Phone', es: 'Teléfono' },
    'location_info': { pt: 'Informações de Localização', en: 'Location Information', es: 'Información de Ubicación' },
    'country': { pt: 'País', en: 'Country', es: 'País' },
    'state': { pt: 'Estado (UF)', en: 'State', es: 'Estado' },
    'city': { pt: 'Cidade', en: 'City', es: 'Ciudad' },
    'full_name_placeholder': { pt: 'Seu nome completo', en: 'Your full name', es: 'Tu nombre completo' },
    'country_placeholder': { pt: 'Digite o país...', en: 'Enter country...', es: 'Ingrese el país...' },
    'Brasil': { pt: 'Brasil', en: 'Brazil', es: 'Brasil' },
    'Portugal': { pt: 'Portugal', en: 'Portugal', es: 'Portugal' },
    'Espanha': { pt: 'Espanha', en: 'Spain', es: 'España' },
    'Itália': { pt: 'Itália', en: 'Italy', es: 'Italia' },
    'Alemanha': { pt: 'Alemanha', en: 'Germany', es: 'Alemania' },
    'França': { pt: 'França', en: 'France', es: 'Francia' },
    'Estados Unidos': { pt: 'Estados Unidos', en: 'United States', es: 'Estados Unidos' },
    'Argentina': { pt: 'Argentina', en: 'Argentina', es: 'Argentina' },
    'Chile': { pt: 'Chile', en: 'Chile', es: 'Chile' },
    'Uruguai': { pt: 'Uruguai', en: 'Uruguay', es: 'Uruguay' },
    'Outro': { pt: 'Outro', en: 'Other', es: 'Otro' },
    'state_placeholder': { pt: 'Digite o estado...', en: 'Enter state...', es: 'Ingrese el estado...' },
    'city_placeholder': { pt: 'Digite sua cidade...', en: 'Enter city...', es: 'Ingrese su ciudad...' },
    'interests_grad': { pt: 'Você tem interesse em cursar uma graduação?', en: 'Are you interested in a degree program?', es: '¿Te interesa cursar una carrera?' },
    'interests_higher': { pt: 'Você tem interesse em:', en: 'Are you interested in:', es: '¿Te interesa:' },
    'second_degree': { pt: 'Segunda Graduação', en: 'Second Degree', es: 'Segunda Carrera' },
    'graduate_study': { pt: 'Pós-graduação', en: 'Graduate Study', es: 'Posgrado' },
    'no_interest_now': { pt: 'Não tenho interesse no momento', en: 'No interest at the moment', es: 'No tengo interés por ahora' },
    'select_course': { pt: 'Selecione o curso...', en: 'Select course...', es: 'Seleccionar carrera...' },
    'yes': { pt: 'Sim', en: 'Yes', es: 'Sí' },
    'no': { pt: 'Não', en: 'No', es: 'No' },
    'course_interest': { pt: 'Qual curso você tem interesse?', en: 'Which course are you interested in?', es: '¿Qué carrera te interesa?' },
    'submit_registration': { pt: 'CONFIRMAR MINHA VAGA', en: 'CONFIRM MY SPOT', es: 'CONFIRMAR MI PLAZA' },
    'complete_fields': { pt: 'COMPLETE OS CAMPOS CORRETAMENTE', en: 'COMPLETE THE FIELDS CORRECTLY', es: 'COMPLETE LOS CAMPOS CORRETAMENTE' },
    'educational_level': { pt: 'Escolaridade Atual', en: 'Current Education Level', es: 'Nivel educativo actual' },
    'select_option': { pt: 'Selecione uma opção...', en: 'Select an option...', es: 'Seleccione una opción...' },
    'institutional_event': { pt: 'Evento Institucional', en: 'Institutional Event', es: 'Evento Institucional' },

    // Education Levels
    'Ensino fundamental': { pt: 'Ensino fundamental', en: 'Middle School', es: 'Educación básica' },
    'Ensino médio completo': { pt: 'Ensino médio completo', en: 'High School Diploma', es: 'Bachillerato completo' },
    'Ensino médio em andamento': { pt: 'Ensino médio em andamento', en: 'High School Student', es: 'Bachillerato en curso' },
    'Ensino superior em andamento': { pt: 'Ensino superior em andamento', en: 'University Student', es: 'Educación superior en curso' },
    'Ensino superior completo': { pt: 'Ensino superior completo', en: 'University Degree', es: 'Educación superior completa' },
    'Pós-graduação': { pt: 'Pós-graduação', en: 'Post-graduate', es: 'Posgrado' },
    'email_error': { pt: 'Formato de e-mail inválido.', en: 'Invalid email format.', es: 'Formato de correo inválido.' },
    'privacy_disclosure': { pt: 'Ao confirmar, seus dados serão compartilhados com a organização para controle de presença e contato institucional.', en: 'By confirming, your data will be shared with the organization for attendance control and institutional contact.', es: 'Al confirmar, sus datos se compartirán con la organización para el control de asistencia y el contacto institucional.' },
    'when': { pt: 'Quando', en: 'When', es: 'Cuándo' },
    'where': { pt: 'Onde', en: 'Where', es: 'Dónde' },
    'institution_local': { pt: 'Auditório UNINASSAU', en: 'UNINASSAU Auditorium', es: 'Auditorio UNINASSAU' },
    'participant': { pt: 'Participante', en: 'Participant', es: 'Participante' },
    'origin': { pt: 'Origem', en: 'Origin', es: 'Origen' },

    // States
    'event_not_available': { pt: 'Evento Não Disponível', en: 'Event Not Available', es: 'Evento no disponible' },
    'event_not_available_msg': { pt: 'Este evento já foi encerrado ou não permite novas confirmações de presença.', en: 'This event has ended or does not allow new registrations.', es: 'Este evento ha finalizado o no permite nuevos registros.' },
    'see_other_events': { pt: 'Ver Outros Eventos', en: 'See Other Events', es: 'Ver otros eventos' },

    // Success page
    'registration_confirmed': { pt: 'Presença Confirmada!', en: 'Registration Confirmed!', es: '¡Registro Confirmado!' },
    'success_msg': { pt: 'Sua participação foi registrada com sucesso no sistema institucional.', en: 'Your participation has been successfully registered in the institutional system.', es: 'Su participación ha sido registrada con éxito en el sistema institucional.' },
    'download_receipt': { pt: 'Baixar Comprovante', en: 'Download Receipt', es: 'Descargar comprobante' },
    'received_downloaded': { pt: 'Comprovante Baixado', en: 'Receipt Downloaded', es: 'Comprobante descargado' },
    'finish': { pt: 'Concluir', en: 'Finish', es: 'Finalizar' },
    'attention': { pt: 'ATENÇÃO', en: 'ATTENTION', es: 'ATENCIÓN' },
    'download_warning': { pt: 'Você deve baixar seu comprovante para liberar o botão de conclusão.', en: 'You must download your receipt to unlock the finish button.', es: 'Debes descargar tu comprobante para habilitar el botón de finalizar.' }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    locale: string;
}

const localeMap: Record<Language, string> = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('app-language');
        return (saved as Language) || 'pt';
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
    };

    const t = (key: string) => {
        // Basic translation for fixed keys
        const translation = translations[key]?.[language];
        if (translation) return translation;

        // Fallback or dynamic translation logic for common words
        // This allows translating some database content if the keys match
        // e.g. "Carnaval" -> "Carnival"
        const commonDynamic: Record<string, Record<Language, string>> = {
            'Carnaval': { pt: 'Carnaval', en: 'Carnival', es: 'Carnaval' },
            'Auditório': { pt: 'Auditório', en: 'Auditorium', es: 'Auditorio' },
            'Interno': { pt: 'Interno', en: 'Internal', es: 'Interno' },
            'Externo': { pt: 'Externo', en: 'External', es: 'Externo' },
            'Processo Seletivo': { pt: 'Processo Seletivo', en: 'Selection Process', es: 'Proceso de Selección' },
            'Vestibular': { pt: 'Vestibular', en: 'Entrance Exam', es: 'Examen de Ingreso' },
            'Palestra': { pt: 'Palestra', en: 'Lecture', es: 'Conferencia' },
            'Workshop': { pt: 'Workshop', en: 'Workshop', es: 'Taller' }
        };

        return commonDynamic[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, locale: localeMap[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
