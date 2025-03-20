// src/Components/Store/MailStore.jsx

import { create } from "zustand";
import { app, db } from "../Database/firebase";
import { getDatabase, ref, update, get, onValue, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export const MailStore = create((set) => ({
  InBoxArray: [],
  SentBoxArray: [],
  StarArray: [],
  TrashArray: [],
    fetchInbox: (ReceiverId) => {
        const dbRef = getDatabase(app);
        const inboxPath = `MailClient/${ReceiverId}/InboxMail`;
        const inboxRef = ref(dbRef, inboxPath);
    
        onValue(inboxRef, (snapshot) => {
        if (snapshot.exists()) {
            const inboxData = Object.entries(snapshot.val()).map(([timestampKey, mailData]) => ({
                ...mailData,
                maildataId: timestampKey,
                ReceiverId: ReceiverId,
            }));
            set({ InBoxArray: inboxData });
        } else {
            set({ InBoxArray: [] });
        }
        });
    },
    fetchSentBox: (SenderId) => {
        const dbRef = getDatabase(app);
        const sentPath = `MailClient/${SenderId}/SentMail`;
        const sentRef = ref(dbRef, sentPath);

        onValue(sentRef, (snapshot) => {
            if (snapshot.exists()) {
                const sentData = Object.entries(snapshot.val()).map(([timestampKey, mailData]) => ({
                    ...mailData,
                    maildataId: timestampKey,
                }));
                set({ SentBoxArray: sentData });
            } else {
                set({ SentBoxArray: [] });
            }
        });
    },
    fetchStarMessages: (ReceiverId) => {
        const dbRef = getDatabase(app);
        const starPath = `MailClient/${ReceiverId}/StarMessage`;
        const starRef = ref(dbRef, starPath);
    
        onValue(starRef, (snapshot) => {
          if (snapshot.exists()) {
            const starData = Object.entries(snapshot.val()).map(([timestampKey, mailData]) => ({
              ...mailData,
              maildataId: timestampKey,
            }));
            set({ StarArray: starData });
          } else {
            set({ StarArray: [] });
          }
        });
    },
    fetchTrashMessages: (ReceiverId) => {
        const dbRef = getDatabase(app);
        const trashPath = `MailClient/${ReceiverId}/TrashMail`;
        const trashRef = ref(dbRef, trashPath);
    
        onValue(trashRef, (snapshot) => {
            if (snapshot.exists()) {
                const trashData = Object.entries(snapshot.val()).map(([timestampKey, mailData]) => ({
                    ...mailData,
                    maildataId: timestampKey,
                }));
                set({ TrashArray: trashData });
            } else {
                set({ TrashArray: [] });
            }
        });
    },
    MailTransfer: async (formData) => {
        const { sendermail, receivermail, mailsubject, mailcompose } = formData;

        if (!sendermail) {
            return { success: false, message: "Sender Email Is Required" };
        }

        if (!receivermail) {
            return { success: false, message: "Receiver Email Is Required" };
        }

        if(sendermail === receivermail) {
            return {success: false, message: "Sender & Receiver Mail Is Same"}
        }

        try {
            const auth = getAuth(app);
            let currentUser = null;

            await new Promise((resolve) => {
                onAuthStateChanged(auth, (user) => {
                currentUser = user;
                resolve();
                });
            });

            if (!currentUser) {
                return { success: false, message: "No authenticated user found" };
            }

            if (currentUser.email.toLowerCase() !== sendermail.toLowerCase()) {
                return { success: false, message: "Sender Is Not Authenticated" };
            }

            const SenderId = currentUser.uid;

            const emailQuery = query(
                collection(db, "EmailDataSet"),
                where("email", "==", receivermail.toLowerCase())
            );
            const querySnapshot = await getDocs(emailQuery);

            if (querySnapshot.empty) {
                return { success: false, message: "Receiver Email Not Found" };
            }

            const ReceiverId = querySnapshot.docs.map((doc) => doc.data().emailId)[0];

            const dbRef = getDatabase(app);
            const senderPath = `MailClient/${SenderId}/SentMail`;
            const receiverPath = `MailClient/${ReceiverId}/InboxMail`;

            const mailData = { sendermail, receivermail, mailsubject, mailcompose,};
            const timestampKey = new Date().getTime().toString();

            await update(ref(dbRef, senderPath), { [timestampKey]: mailData });
            await update(ref(dbRef, receiverPath), { [timestampKey]: mailData });
            await Promise.all([
                MailStore.getState().fetchInbox(ReceiverId),
                MailStore.getState().fetchSentBox(SenderId),
            ]);

            return { success: true, message: "Mail successfully sent and stored" };
        } catch (error) {
            console.error("Error storing mail:", error);
            return { success: false, message: "Error storing mail" };
        }
    },
    StarMessage: async (ReceiverId, mailData) => {
        if (!ReceiverId || !mailData) {
            return { success: false, message: "ReceiverId or MailData is missing" };
        }
        try {
            const dbRef = getDatabase(app);
            const starPath = `MailClient/${ReceiverId}/StarMessage/${mailData.maildataId}`;
            const starRef = ref(dbRef, starPath);
    
            const receiverRef = ref(dbRef, `MailClient/${ReceiverId}`);
            const receiverSnapshot = await get(receiverRef);
    
            if (!receiverSnapshot.exists()) {
                return { success: false, message: "ReceiverId does not exist" };
            }
    
            const starSnapshot = await get(starRef);
            if (starSnapshot.exists()) {
                return { success: false, message: "Message is already in the Star section" };
            }
            await update(starRef, { mailcompose: mailData.mailcompose, mailsubject: mailData.mailsubject, receivermail: mailData.receivermail, sendermail: mailData.sendermail,});
            MailStore.getState().fetchStarMessages(ReceiverId);
            return { success: true, message: "Message starred successfully" };
        } catch (error) {
            return { success: false, message: "Error starring message" };
        }
    },
    UnstarMessage: async (ReceiverId, mailData) => {
        if (!ReceiverId || !mailData) {
            return { success: false, message: "ReceiverId or MailData is missing" };
        }
        try {
            const dbRef = getDatabase(app);
            const starPath = `MailClient/${ReceiverId}/StarMessage/${mailData.maildataId}`;
            const starRef = ref(dbRef, starPath);
    
            const starSnapshot = await get(starRef);
            if (!starSnapshot.exists()) {
                return { success: false, message: "Message is not starred" };
            }
    
            await update(ref(dbRef, `MailClient/${ReceiverId}/StarMessage`), {
                [mailData.maildataId]: null,
            });
            MailStore.getState().fetchStarMessages(ReceiverId);
            return { success: true, message: "Message unstarred successfully" };
        } catch (error) {
            return { success: false, message: "Error unstarring message" };
        }
    },
    TrashMessage: async (ReceiverId, mailData) => {
        if (!ReceiverId || !mailData) {
            return { success: false, message: "ReceiverId or MailData is missing" };
        }
        try {
            const dbRef = getDatabase(app);
            const trashPath = `MailClient/${ReceiverId}/TrashMail/${mailData.maildataId}`;
            const trashRef = ref(dbRef, trashPath);
    
            const trashSnapshot = await get(trashRef);
            if (trashSnapshot.exists()) {
                return { success: false, message: "Mail is already in Trash" };
            }
            const inboxPath = `MailClient/${ReceiverId}/InboxMail/${mailData.maildataId}`;
            const inboxRef = ref(dbRef, inboxPath);
            await remove(inboxRef);

            await update(trashRef, {
                mailcompose: mailData.mailcompose,
                mailsubject: mailData.mailsubject,
                receivermail: mailData.receivermail,
                sendermail: mailData.sendermail,
            });
    
            MailStore.getState().fetchInbox(ReceiverId);
            MailStore.getState().fetchTrashMessages(ReceiverId);
    
            return { success: true, message: "Mail moved to Trash successfully" };
        } catch (error) {
            console.error("Error trashing message:", error);
            return { success: false, message: "Error moving mail to Trash" };
        }
    },
    UnTrashMessage: async (ReceiverId, mailData) => {
        if (!ReceiverId || !mailData) {
          return { success: false, message: "ReceiverId or MailData is missing" };
        }
        try {
          const dbRef = getDatabase(app);
          const trashPath = `MailClient/${ReceiverId}/TrashMail/${mailData.maildataId}`;
          const inboxPath = `MailClient/${ReceiverId}/InboxMail/${mailData.maildataId}`;
          const trashRef = ref(dbRef, trashPath);
          const inboxRef = ref(dbRef, inboxPath);

          const trashSnapshot = await get(trashRef);
          if (!trashSnapshot.exists()) {
            return { success: false, message: "Mail not found in Trash" };
          }

          const mailDataToRestore = trashSnapshot.val();
          await update(inboxRef, mailDataToRestore);
          await remove(trashRef);

          MailStore.getState().fetchInbox(ReceiverId);
          MailStore.getState().fetchTrashMessages(ReceiverId);
      
          return { success: true, message: "Mail restored to Inbox successfully" };
        } catch (error) {
          console.error("Error restoring mail:", error);
          return { success: false, message: "Error restoring mail" };
        }
    },
    DeleteTrashMessage: async(ReceiverId, mailData) => {
        if (!ReceiverId || !mailData) {
            return { success: false, message: "ReceiverId or MailData is missing" };
        }
        try {
            const dbRef = getDatabase(app);
            const trashPath = `MailClient/${ReceiverId}/TrashMail/${mailData.maildataId}`;
            const trashRef = ref(dbRef, trashPath);
        
            await remove(trashRef);
            await MailStore.getState().fetchTrashMessages(ReceiverId);
        
            return { success: true, message: "Mail deleted successfully from the server" };
        } catch (error) {
            console.error("Error deleting mail:", error);
            return { success: false, message: "An error occurred while deleting the mail from the server" };
        }
    },
}));
