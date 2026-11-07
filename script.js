// ===============================
// MOBILE MENU
// ===============================

function toggleMenu() {
    const nav = document.getElementById("mainNav");

    if (nav) {
        nav.classList.toggle("active");
    }
}


// ===============================
// DONOR REGISTRATION
// ===============================

const donorForm = document.getElementById("donorForm");

if (donorForm) {

    donorForm.addEventListener("submit", async function (e) {

        e.preventDefault();
        const age = Number(document.getElementById("age").value);

if (age < 18 || age > 65) {
    alert("❌ Donor is not eligible. Age must be between 18 and 65.");
    return;
}
const lastDonation =
    document.getElementById("lastDonation").value;

if (lastDonation) {

    const donationDate =
        new Date(lastDonation);

    const today = new Date();

    const monthsDifference =
        (today.getFullYear() - donationDate.getFullYear()) * 12 +
        (today.getMonth() - donationDate.getMonth());

    if (monthsDifference < 3) {

        alert(
            "❌ Donor is not eligible. Last donation must be at least 3 months ago."
        );

        return;
    }
}

        const donorData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            phone: document.getElementById("phone").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            bloodGroup: document.getElementById("bloodGroup").value,
            city: document.getElementById("city").value,
            address: document.getElementById("address").value,
            lastDonation: document.getElementById("lastDonation").value
        };

        try {

            const response = await fetch("/api/donors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(donorData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Donor Registration Successful!");
                donorForm.reset();
            } else {
                alert(data.message || "Registration Failed");
            }

        } catch (error) {
            console.error("Donor Error:", error);
            alert("Server Error");
        }

    });

}


// ===============================
// BLOOD REQUEST
// ===============================

const requestForm = document.getElementById("requestForm");

if (requestForm) {

    requestForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const requestData = {
            patientName: document.getElementById("patientName").value,
            hospitalName: document.getElementById("hospitalName").value,
            contact: document.getElementById("contact").value,
            bloodGroup: document.getElementById("requestBloodGroup").value,
            units: document.getElementById("units").value,
            requiredDate: document.getElementById("requiredDate").value,
            reason: document.getElementById("reason").value,
            priority: document.getElementById("priority").value,
            address: document.getElementById("address").value
        };

        try {

            const response = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Blood Request Submitted Successfully!");
                requestForm.reset();
            } else {
                alert(data.message || "Request Failed");
            }

        } catch (error) {
            console.error("Request Error:", error);
            alert("Server Error");
        }

    });

}


// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const contactData = {
            name: document.getElementById("contactName").value,
            email: document.getElementById("contactEmail").value,
            phone: document.getElementById("contactPhone").value,
            message: document.getElementById("message").value
        };

        try {

            const response = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Message Sent Successfully!");
                contactForm.reset();
            } else {
                alert(data.message || "Message Failed");
            }

        } catch (error) {
            console.error("Contact Error:", error);
            alert("Server Error");
        }

    });

}


// ===============================
// PUBLIC INVENTORY
// ===============================

const inventoryTable =
    document.getElementById("inventoryTable");

if (inventoryTable) {

    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            inventoryTable.innerHTML = "";

            inventory.forEach(item => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.bloodGroup}</td>
                    <td>${item.units}</td>
                    <td>${item.status}</td>
                `;

                inventoryTable.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Inventory Error:", error);
        });

}


// ===============================
// ADMIN DASHBOARD ELEMENTS
// ===============================

const dashboardDonors =
    document.getElementById("dashboardDonors");

const dashboardRequests =
    document.getElementById("dashboardRequests");

const dashboardContacts =
    document.getElementById("dashboardMessages");

const dashboardInventory =
    document.getElementById("dashboardInventory");

const totalDonors =
    document.getElementById("totalDonors");

const totalBloodUnits =
    document.getElementById("totalBloodUnits");

const totalRequests =
    document.getElementById("totalRequests");

const totalMessages =
    document.getElementById("totalMessages");


// ===============================
// DASHBOARD SUMMARY
// ===============================

function loadDashboardSummary() {

    fetch("/api/donors")
        .then(response => response.json())
        .then(donors => {

            if (totalDonors) {
                totalDonors.textContent = donors.length;
            }

        })
        .catch(error => {
            console.error("Summary Donor Error:", error);
        });


    fetch("/api/requests")
        .then(response => response.json())
        .then(requests => {

            if (totalRequests) {
                totalRequests.textContent = requests.length;
            }

        })
        .catch(error => {
            console.error("Summary Request Error:", error);
        });


    fetch("/api/contacts")
        .then(response => response.json())
        .then(messages => {

            if (totalMessages) {
                totalMessages.textContent = messages.length;
            }

        })
        .catch(error => {
            console.error("Summary Message Error:", error);
        });


    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            let totalUnits = 0;

            inventory.forEach(item => {
                totalUnits += Number(item.units);
            });

            if (totalBloodUnits) {
                totalBloodUnits.textContent = totalUnits;
            }

        })
        .catch(error => {
            console.error("Summary Inventory Error:", error);
        });

}

if (
    totalDonors ||
    totalRequests ||
    totalMessages ||
    totalBloodUnits
) {
    loadDashboardSummary();
}


// ===============================
// GET DONORS
// ===============================

if (dashboardDonors) {

    fetch("/api/donors")
        .then(response => response.json())
        .then(donors => {

            dashboardDonors.innerHTML = "";

            donors.forEach(donor => {

                const row =
                    document.createElement("tr");

                row.setAttribute(
                    "data-date",
                    donor.createdAt
                        ? new Date(donor.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : ""
                );

                row.innerHTML = `

                    <td>${donor.name}</td>
                    <td>${donor.bloodGroup}</td>
                    <td>${donor.city}</td>
                    <td>${donor.phone}</td>

                    <td>

                        <button
                            onclick='viewDonor(${JSON.stringify(donor)})'
                            style="
                                background:#b30000;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            👁️ View
                        </button>

                        <button
                            onclick='editDonor(${JSON.stringify(donor)})'
                            style="
                                background:#007bff;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            ✏️ Edit
                        </button>

                        <button
                            onclick="deleteDonor('${donor._id}')"
                            style="
                                background:#dc3545;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            🗑️ Delete
                        </button>

                    </td>
                `;

                dashboardDonors.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Donor Error:", error);
        });

}


// ===============================
// GET BLOOD REQUESTS
// ===============================

if (dashboardRequests) {

    fetch("/api/requests")
        .then(response => response.json())
        .then(requests => {

            dashboardRequests.innerHTML = "";

            let pending = 0;
            let approved = 0;
            let completed = 0;
            let rejected = 0;


            // EMERGENCY REQUESTS FIRST

            requests.sort((a, b) => {

                if (
                    a.priority === "Emergency" &&
                    b.priority !== "Emergency"
                ) {
                    return -1;
                }

                if (
                    a.priority !== "Emergency" &&
                    b.priority === "Emergency"
                ) {
                    return 1;
                }

                return 0;
            });


            requests.forEach(request => {

                const status =
                    request.status || "Pending";

                const priority =
                    request.priority || "Normal";


                // STATUS COUNT

                if (status === "Pending") {
                    pending++;
                }

                else if (status === "Approved") {
                    approved++;
                }

                else if (status === "Completed") {
                    completed++;
                }

                else if (status === "Rejected") {
                    rejected++;
                }


                // CREATE ROW

                const row =
                    document.createElement("tr");


                // DATE FILTER DATA

                row.setAttribute(
                    "data-date",
                    request.createdAt
                        ? new Date(request.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : ""
                );


                // ⭐ IMPORTANT PRIORITY DATA

                row.setAttribute(
                    "data-priority",
                    priority
                );


                // EMERGENCY BACKGROUND

                if (priority === "Emergency") {

                    row.style.backgroundColor =
                        "#ffe0e0";
                }


                // ROW HTML

                row.innerHTML = `

                    <td>${request.patientName}</td>

                    <td>${request.hospitalName}</td>

                    <td>${request.bloodGroup}</td>

                    <td>${request.units}</td>

                    <td>
                        ${
                            priority === "Emergency"
                                ? "🚨 Emergency"
                                : "Normal"
                        }
                    </td>

                    <td class="status-${status.toLowerCase()}">
                        ${status}
                    </td>
<td>

    ${
        status === "Pending"
            ? `
                <button
                    onclick="changeRequestStatus('${request._id}', 'Approved')"
                    style="
                        background:#28a745;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:5px;
                        cursor:pointer;
                        margin:3px;
                    "
                >
                    ✅ Approve
                </button>

                <button
                    onclick="changeRequestStatus('${request._id}', 'Rejected')"
                    style="
                        background:#dc3545;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:5px;
                        cursor:pointer;
                        margin:3px;
                    "
                >
                    ❌ Reject
                </button>
            `
            : ""
    }

    ${
        status === "Approved"
            ? `
                <button
                    onclick="changeRequestStatus('${request._id}', 'Completed')"
                    style="
                        background:#007bff;
                        color:white;
                        border:none;
                        padding:8px 12px;
                        border-radius:5px;
                        cursor:pointer;
                        margin:3px;
                    "
                >
                    ✔️ Complete
                </button>
            `
            : ""
    }

    <button
        onclick='editRequest(${JSON.stringify(request)})'
        style="
            background:#007bff;
            color:white;
            border:none;
            padding:8px 12px;
            border-radius:5px;
            cursor:pointer;
            margin:3px;
        "
    >
        ✏️ Edit
    </button>

    <button
        onclick='viewRequest(${JSON.stringify(request)})'
        style="
            background:#b30000;
            color:white;
            border:none;
            padding:8px 12px;
            border-radius:5px;
            cursor:pointer;
            margin:3px;
        "
    >
        👁️ View
    </button>

    <button
        onclick="deleteRequest('${request._id}')"
        style="
            background:#dc3545;
            color:white;
            border:none;
            padding:8px 12px;
            border-radius:5px;
            cursor:pointer;
            margin:3px;
        "
    >
        🗑️ Delete
    </button>

</td>

                `;

                dashboardRequests.appendChild(row);

            });


            // STATUS CARDS

            const pendingElement =
                document.getElementById("pendingRequests");

            const approvedElement =
                document.getElementById("approvedRequests");

            const completedElement =
                document.getElementById("completedRequests");

            const rejectedElement =
                document.getElementById("rejectedRequests");


            if (pendingElement) {
                pendingElement.textContent = pending;
            }

            if (approvedElement) {
                approvedElement.textContent = approved;
            }

            if (completedElement) {
                completedElement.textContent = completed;
            }

            if (rejectedElement) {
                rejectedElement.textContent = rejected;
            }

        })
        .catch(error => {
            console.error("Request Error:", error);
        });

}


// ===============================
// GET CONTACT MESSAGES
// ===============================

if (dashboardContacts) {

    fetch("/api/contacts")
        .then(response => response.json())
        .then(messages => {

            dashboardContacts.innerHTML = "";

            messages.forEach(message => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.phone}</td>
                    <td>${message.message}</td>

                    <td>

                        <button
                            onclick='viewMessage(${JSON.stringify(message)})'
                            style="
                                background:#b30000;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            👁️ View
                        </button>

                        <button
                            onclick='editMessage(${JSON.stringify(message)})'
                            style="
                                background:#007bff;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            ✏️ Edit
                        </button>

                        <button
                            onclick="deleteMessage('${message._id}')"
                            style="
                                background:#dc3545;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            🗑️ Delete
                        </button>

                    </td>
                `;

                dashboardContacts.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Contact Error:", error);
        });

}


// ===============================
// GET INVENTORY
// ===============================

if (dashboardInventory) {
    loadInventory();
}


// ===============================
// LOAD INVENTORY
// ===============================

function loadInventory() {

    if (!dashboardInventory) {
        return;
    }

    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            let totalUnits = 0;

            inventory.forEach(item => {
                totalUnits += Number(item.units);
            });

            if (totalBloodUnits) {
                totalBloodUnits.textContent =
                    totalUnits;
            }

            dashboardInventory.innerHTML = "";

            inventory.forEach(item => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>${item.bloodGroup}</td>
                    <td>${item.units}</td>
                    <td>${item.status}</td>

                    <td>

                        <button
                            onclick='editInventory(${JSON.stringify(item)})'
                            style="
                                background:#007bff;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            ✏️ Edit
                        </button>

                        <button
                            onclick="deleteInventory('${item._id}')"
                            style="
                                background:#dc3545;
                                color:white;
                                border:none;
                                padding:8px 12px;
                                border-radius:5px;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            🗑️ Delete
                        </button>

                    </td>
                `;

                dashboardInventory.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Inventory Error:", error);
        });

}


// ===============================
// ADD INVENTORY
// ===============================

function addInventory() {

    const bloodGroup =
        document.getElementById(
            "inventoryBloodGroup"
        ).value;

    const units =
        document.getElementById(
            "inventoryUnits"
        ).value;

    const status =
        document.getElementById(
            "inventoryStatus"
        ).value;


    fetch("/api/inventory", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            bloodGroup,
            units,
            status
        })

    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);

            document.getElementById(
                "inventoryBloodGroup"
            ).value = "";

            document.getElementById(
                "inventoryUnits"
            ).value = "";

            document.getElementById(
                "inventoryStatus"
            ).value = "";

            loadInventory();
            loadDashboardSummary();

        })
        .catch(error => {
            console.error(
                "Add Inventory Error:",
                error
            );
        });

}


// ===============================
// EDIT INVENTORY
// ===============================

function editInventory(item) {

    const bloodGroup =
        prompt(
            "Blood Group:",
            item.bloodGroup
        );

    const units =
        prompt(
            "Units:",
            item.units
        );

    const status =
        prompt(
            "Status:",
            item.status
        );


    if (
        bloodGroup === null ||
        units === null ||
        status === null
    ) {
        return;
    }


    updateInventory(
        item._id,
        bloodGroup,
        units,
        status
    );

}


// ===============================
// UPDATE INVENTORY
// ===============================

function updateInventory(
    id,
    bloodGroup,
    units,
    status
) {

    fetch(`/api/inventory/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            bloodGroup,
            units,
            status
        })

    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);

            loadInventory();
            loadDashboardSummary();

        })
        .catch(error => {
            console.error(
                "Update Inventory Error:",
                error
            );
        });

}


// ===============================
// DELETE INVENTORY
// ===============================

function deleteInventory(id) {

    if (!confirm("Delete this inventory?")) {
        return;
    }

    fetch(`/api/inventory/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);

            loadInventory();
            loadDashboardSummary();

        })
        .catch(error => {
            console.error(
                "Delete Inventory Error:",
                error
            );
        });

}


// ===============================
// VIEW DONOR
// ===============================

function viewDonor(donor) {

    alert(

        "Donor Details\n\n" +

        "Name: " +
        donor.name + "\n" +

        "Email: " +
        donor.email + "\n" +

        "Phone: " +
        donor.phone + "\n" +

        "Age: " +
        donor.age + "\n" +

        "Gender: " +
        donor.gender + "\n" +

        "Blood Group: " +
        donor.bloodGroup + "\n" +

        "City: " +
        donor.city + "\n" +

        "Address: " +
        donor.address + "\n" +

        "Last Donation: " +
        (donor.lastDonation || "Not Provided")

    );

}


// ===============================
// EDIT DONOR
// ===============================

function editDonor(donor) {

    const name =
        prompt("Name:", donor.name);

    const email =
        prompt("Email:", donor.email);

    const phone =
        prompt("Phone:", donor.phone);

    const age =
        prompt("Age:", donor.age);

    const gender =
        prompt("Gender:", donor.gender);

    const bloodGroup =
        prompt("Blood Group:", donor.bloodGroup);

    const city =
        prompt("City:", donor.city);

    const address =
        prompt("Address:", donor.address);

    const lastDonation =
        prompt(
            "Last Donation:",
            donor.lastDonation || ""
        );


    if (
        name === null ||
        email === null ||
        phone === null ||
        age === null ||
        gender === null ||
        bloodGroup === null ||
        city === null ||
        address === null ||
        lastDonation === null
    ) {
        return;
    }


    updateDonor(
        donor._id,
        {
            name,
            email,
            phone,
            age,
            gender,
            bloodGroup,
            city,
            address,
            lastDonation
        }
    );

}


// ===============================
// UPDATE DONOR
// ===============================

function updateDonor(
    id,
    donorData
) {

    fetch(`/api/donors/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(donorData)

    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Update Donor Error:",
                error
            );

        });

}


// ===============================
// DELETE DONOR
// ===============================

function deleteDonor(id) {

    if (!confirm("Delete this donor?")) {
        return;
    }

    fetch(`/api/donors/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Delete Donor Error:",
                error
            );

        });

}


// ===============================
// VIEW REQUEST
// ===============================

function viewRequest(request) {

    alert(

        "Blood Request Details\n\n" +

        "Patient Name: " +
        request.patientName + "\n" +

        "Hospital: " +
        request.hospitalName + "\n" +

        "Contact: " +
        request.contact + "\n" +

        "Blood Group: " +
        request.bloodGroup + "\n" +

        "Units: " +
        request.units + "\n" +

        "Required Date: " +
        request.requiredDate + "\n" +

        "Reason: " +
        (request.reason || "Not Provided") + "\n" +

        "Priority: " +
        (request.priority || "Normal") + "\n" +

        "Address: " +
        request.address + "\n" +

        "Status: " +
        (request.status || "Pending")

    );

}


// ===============================
// EDIT REQUEST
// ===============================

function editRequest(request) {

    const patientName =
        prompt(
            "Patient Name:",
            request.patientName
        );

    const hospitalName =
        prompt(
            "Hospital:",
            request.hospitalName
        );

    const contact =
        prompt(
            "Contact:",
            request.contact
        );

    const bloodGroup =
        prompt(
            "Blood Group:",
            request.bloodGroup
        );

    const units =
        prompt(
            "Units:",
            request.units
        );

    const requiredDate =
        prompt(
            "Required Date:",
            request.requiredDate
        );

    const reason =
        prompt(
            "Reason:",
            request.reason || ""
        );

    const priority =
        prompt(
            "Priority (Normal / Emergency):",
            request.priority || "Normal"
        );

    const address =
        prompt(
            "Address:",
            request.address
        );

    const status =
        prompt(
            "Status (Pending / Approved / Completed / Rejected):",
            request.status || "Pending"
        );


    if (
        patientName === null ||
        hospitalName === null ||
        contact === null ||
        bloodGroup === null ||
        units === null ||
        requiredDate === null ||
        reason === null ||
        priority === null ||
        address === null ||
        status === null
    ) {
        return;
    }


    updateRequest(

        request._id,

        {
            patientName,
            hospitalName,
            contact,
            bloodGroup,
            units,
            requiredDate,
            reason,
            priority,
            address,
            status
        }

    );

}

// ===============================
// CHANGE REQUEST STATUS
// ===============================

function changeRequestStatus(id, status) {

    if (!confirm("Change request status to " + status + "?")) {
        return;
    }

    fetch(`/api/requests/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status: status
        })

    })
        .then(response => response.json())
        .then(data => {

            alert(
                data.message ||
                "Request status updated successfully"
            );

            location.reload();

        })
        .catch(error => {

            console.error(
                "Status Update Error:",
                error
            );

            alert("Unable to update request status");

        });
}
// ===============================
// UPDATE REQUEST
// ===============================

function updateRequest(
    id,
    requestData
) {

    fetch(`/api/requests/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(requestData)

    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Update Request Error:",
                error
            );

        });

}


// ===============================
// DELETE REQUEST
// ===============================

function deleteRequest(id) {

    if (!confirm("Delete this blood request?")) {
        return;
    }

    fetch(`/api/requests/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Delete Request Error:",
                error
            );

        });

}


// ===============================
// VIEW CONTACT MESSAGE
// ===============================

function viewMessage(message) {

    alert(

        "Contact Message\n\n" +

        "Name: " +
        message.name + "\n" +

        "Email: " +
        message.email + "\n" +

        "Phone: " +
        message.phone + "\n\n" +

        "Message:\n" +
        message.message

    );

}


// ===============================
// EDIT CONTACT MESSAGE
// ===============================

function editMessage(message) {

    const name =
        prompt(
            "Name:",
            message.name
        );

    const email =
        prompt(
            "Email:",
            message.email
        );

    const phone =
        prompt(
            "Phone:",
            message.phone
        );

    const newMessage =
        prompt(
            "Message:",
            message.message
        );


    if (
        name === null ||
        email === null ||
        phone === null ||
        newMessage === null
    ) {
        return;
    }


    updateMessage(

        message._id,

        {
            name,
            email,
            phone,
            message: newMessage
        }

    );

}


// ===============================
// UPDATE CONTACT MESSAGE
// ===============================

function updateMessage(
    id,
    messageData
) {

    fetch(`/api/contacts/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(messageData)

    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Update Message Error:",
                error
            );

        });

}


// ===============================
// DELETE CONTACT MESSAGE
// ===============================

function deleteMessage(id) {

    if (!confirm("Delete this message?")) {
        return;
    }

    fetch(`/api/contacts/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);
            location.reload();

        })
        .catch(error => {

            console.error(
                "Delete Message Error:",
                error
            );

        });

}


// ===============================
// BLOOD GROUP STATISTICS
// ===============================

const bloodGroupStats =
    document.getElementById("bloodGroupStats");

if (bloodGroupStats) {

    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            bloodGroupStats.innerHTML = "";

            if (inventory.length === 0) {

                bloodGroupStats.innerHTML =
                    "<p>No inventory data available.</p>";

                return;
            }

            const maxUnits =
                Math.max(
                    ...inventory.map(
                        item => Number(item.units)
                    )
                );

            inventory.forEach(item => {

                let percentage = 0;

                if (maxUnits > 0) {

                    percentage =
                        (Number(item.units) /
                            maxUnits) * 100;
                }

                bloodGroupStats.innerHTML += `

                    <div class="blood-stat">

                        <h3>
                            ${item.bloodGroup}
                        </h3>

                        <p>
                            ${item.units} Units
                        </p>

                        <div class="stat-bar">

                            <div
                                class="stat-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>
                `;

            });

        })
        .catch(error => {

            console.error(
                "Statistics Error:",
                error
            );

            bloodGroupStats.innerHTML =
                "<p>Unable to load statistics.</p>";

        });

}


// ===============================
// STOCK ALERTS
// ===============================

const stockAlerts =
    document.getElementById("stockAlerts");
    const inventoryUpdateAlert =
    document.getElementById("inventoryUpdateAlert");

if (stockAlerts) {

    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            stockAlerts.innerHTML = "";

            const lowStock =
                inventory.filter(
                    item =>
                        Number(item.units) > 20 &&
                        Number(item.units) <= 50
                );

            const criticalStock =
                inventory.filter(
                    item =>
                        Number(item.units) <= 20
                );


            if (criticalStock.length > 0) {

                criticalStock.forEach(item => {

                    stockAlerts.innerHTML += `

                        <div class="stock-alert critical-alert">

                            🔴 Critical Stock:
                            ${item.bloodGroup}
                            - ${item.units} Units

                        </div>
                    `;

                });

            }


            if (lowStock.length > 0) {

                lowStock.forEach(item => {

                    stockAlerts.innerHTML += `

                        <div class="stock-alert low-alert">

                            🟡 Low Stock:
                            ${item.bloodGroup}
                            - ${item.units} Units

                        </div>
                    `;

                });

            }


            if (
                criticalStock.length === 0 &&
                lowStock.length === 0
            ) {

                stockAlerts.innerHTML = `

                    <div class="no-alert">

                        🟢 All Blood Groups have sufficient stock.

                    </div>
                `;

            }
    

        })
        .catch(error => {

            console.error(
                "Stock Alert Error:",
                error
            );

        });

}


// ===============================
// SEARCH + DATE + PRIORITY
// BLOOD REQUESTS
// ===============================

function searchRequests() {

    const searchInput =
        document.getElementById("requestSearch");

    const dateFilter =
        document.getElementById("requestDateFilter");

    const priorityFilter =
        document.getElementById("requestPriorityFilter");


    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value.toLowerCase();

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";

    const selectedPriority =
        priorityFilter
            ? priorityFilter.value
            : "";


    const rows =
        document.querySelectorAll(
            "#dashboardRequests tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        const requestDate =
            row.getAttribute("data-date") || "";

        const priority =
            row.getAttribute("data-priority") || "Normal";


        const matchesSearch =
            text.includes(search);


        const matchesPriority =
            selectedPriority === "" ||
            priority === selectedPriority;


        let matchesDate = true;


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const yesterdayDate =
            new Date();

        yesterdayDate.setDate(
            yesterdayDate.getDate() - 1
        );


        const yesterday =
            yesterdayDate
                .toISOString()
                .split("T")[0];


        if (selectedDate === "today") {

            matchesDate =
                requestDate === today;
        }


        if (selectedDate === "yesterday") {

            matchesDate =
                requestDate === yesterday;
        }


        row.style.display =
            matchesSearch &&
            matchesDate &&
            matchesPriority
                ? ""
                : "none";

    });

}


// DATE FILTER

function filterRequestsByDate() {
    searchRequests();
}


// ⭐ PRIORITY FILTER

function filterRequestsByPriority() {
    searchRequests();
}


// SEARCH EVENT

const requestSearch =
    document.getElementById("requestSearch");

if (requestSearch) {

    requestSearch.addEventListener(
        "input",
        searchRequests
    );

}


// ===============================
// SEARCH DONORS
// ===============================

function searchDonors() {

    const searchInput =
        document.getElementById("donorSearch");

    const filter =
        document.getElementById("bloodGroupFilter");

    const dateFilter =
        document.getElementById("donorDateFilter");


    if (!searchInput) return;


    const search =
        searchInput.value.toLowerCase();

    const selectedGroup =
        filter
            ? filter.value.toLowerCase()
            : "";

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";


    const rows =
        document.querySelectorAll(
            "#dashboardDonors tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        const cells =
            row.querySelectorAll("td");


        const bloodGroup =
            cells[1]
                ? cells[1]
                    .textContent
                    .trim()
                    .toLowerCase()
                : "";


        const donorDate =
            row.getAttribute("data-date") || "";


        const matchesSearch =
            text.includes(search);


        const matchesGroup =
            selectedGroup === "" ||
            bloodGroup === selectedGroup;


        let matchesDate = true;


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const yesterdayDate =
            new Date();

        yesterdayDate.setDate(
            yesterdayDate.getDate() - 1
        );


        const yesterday =
            yesterdayDate
                .toISOString()
                .split("T")[0];


        if (selectedDate === "today") {

            matchesDate =
                donorDate === today;
        }


        if (selectedDate === "yesterday") {

            matchesDate =
                donorDate === yesterday;
        }


        row.style.display =
            matchesSearch &&
            matchesGroup &&
            matchesDate
                ? ""
                : "none";

    });

}


function filterDonorsByBloodGroup() {
    searchDonors();
}


function filterDonorsByDate() {
    searchDonors();
}


// DONOR SEARCH EVENT

const donorSearch =
    document.getElementById("donorSearch");

if (donorSearch) {

    donorSearch.addEventListener(
        "input",
        searchDonors
    );

}


// ===============================
// ADMIN LOGIN
// ===============================

const adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const username =
                document.getElementById(
                    "adminUsername"
                ).value;


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        "/api/admin-login",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username,
                                    password
                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    response.ok &&
                    data.success
                ) {

                    sessionStorage.setItem(
                        "adminLoggedIn",
                        "true"
                    );


                    window.location.href =
                        "admin.html";

                } else {

                    alert(
                        data.message ||
                        "Invalid Login"
                    );

                }

            }

            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                alert(
                    "Server Error"
                );

            }

        }
    );

}


// ===============================
// ADMIN LOGOUT
// ===============================

function adminLogout() {

    sessionStorage.removeItem(
        "adminLoggedIn"
    );

    window.location.href =
        "admin-login.html";

}


// ===============================
// REFRESH DASHBOARD
// ===============================

function refreshDashboard() {

    location.reload();

}


// ===============================
// BLOOD INVENTORY CHART
// ===============================

fetch("/api/inventory")
    .then(response => response.json())
    .then(inventory => {

        const chartElement =
            document.getElementById(
                "bloodInventoryChart"
            );

        if (!chartElement) return;


        new Chart(chartElement, {

            type: "bar",

            data: {

                labels:
                    inventory.map(
                        item => item.bloodGroup
                    ),

                datasets: [{

                    label: "Blood Units",

                    data:
                        inventory.map(
                            item => item.units
                        )

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }

                }

            }

        });

    })
    .catch(error => {

        console.error(
            "Inventory Chart Error:",
            error
        );

    });


// ===============================
// REQUEST STATUS CHART
// ===============================

fetch("/api/requests")
    .then(response => response.json())
    .then(requests => {

        const chartElement =
            document.getElementById(
                "requestStatusChart"
            );

        if (!chartElement) return;


        const pending =
            requests.filter(
                r => r.status === "Pending"
            ).length;


        const approved =
            requests.filter(
                r => r.status === "Approved"
            ).length;


        const completed =
            requests.filter(
                r => r.status === "Completed"
            ).length;


        const rejected =
            requests.filter(
                r => r.status === "Rejected"
            ).length;


        new Chart(chartElement, {

            type: "bar",

            data: {

                labels: [
                    "Pending",
                    "Approved",
                    "Completed",
                    "Rejected"
                ],

                datasets: [{

                    label: "Blood Requests",

                    data: [
                        pending,
                        approved,
                        completed,
                        rejected
                    ]

                }]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            stepSize: 1
                        }

                    }

                }

            }

        });

    })
    .catch(error => {

        console.error(
            "Request Status Chart Error:",
            error
        );

    });


// ===============================
// PRINT DASHBOARD
// ===============================

function printDashboard() {
    window.print();
}


// ===============================
// EXPORT DASHBOARD
// ===============================

function exportDashboard() {

    const data = [
        ["Blood Bank Dashboard Report"],
        [],
        ["Blood Group", "Units"]
    ];


    fetch("/api/inventory")
        .then(response => response.json())
        .then(inventory => {

            inventory.forEach(item => {

                data.push([
                    item.bloodGroup,
                    item.units
                ]);

            });


            const csv =
                data.map(row =>
                    row.join(",")
                ).join("\n");


            const blob =
                new Blob(
                    [csv],
                    { type: "text/csv" }
                );


            const url =
                URL.createObjectURL(blob);


            const a =
                document.createElement("a");


            a.href = url;

            a.download =
                "Blood_Bank_Dashboard_Report.csv";


            a.click();


            URL.revokeObjectURL(url);

        })
        .catch(error => {

            console.error(
                "Export Error:",
                error
            );

        });

}


// ===============================
// LIVE DATE & TIME
// ===============================

function updateDashboardDateTime() {

    const dateTime =
        document.getElementById(
            "dashboardDateTime"
        );


    if (!dateTime) return;


    const now =
        new Date();


    dateTime.textContent =
        "📅 " +
        now.toLocaleDateString() +
        " | 🕐 " +
        now.toLocaleTimeString();

}


updateDashboardDateTime();


setInterval(
    updateDashboardDateTime,
    1000
);


// ===============================
// EMERGENCY ALERT
// ===============================

function checkEmergencyRequests() {

    const alertBox =
        document.getElementById(
            "emergencyAlert"
        );


    if (!alertBox) return;


    fetch("/api/requests")
        .then(response => response.json())
        .then(requests => {

            const emergencyRequests =
                requests.filter(
                    request =>
                        request.priority === "Emergency" &&
                        request.status === "Pending"
                );


            if (emergencyRequests.length > 0) {

                alertBox.innerHTML = `

                    🚨 EMERGENCY BLOOD REQUEST
                    <br>

                    ${emergencyRequests.length}
                    Emergency Request(s) Pending

                `;

            }

            else {

                alertBox.innerHTML = "";

            }

        })
        .catch(error => {

            console.error(
                "Emergency Alert Error:",
                error
            );

        });

}


checkEmergencyRequests();


setInterval(
    checkEmergencyRequests,
    5000
);


// ===============================
// EMERGENCY COUNT
// ===============================

function updateEmergencyCount() {

    const countElement =
        document.getElementById(
            "emergencyRequests"
        );


    if (!countElement) return;


    fetch("/api/requests")
        .then(response => response.json())
        .then(requests => {

            const emergencyCount =
                requests.filter(
                    request =>
                        request.priority === "Emergency" &&
                        request.status === "Pending"
                ).length;


            countElement.textContent =
                emergencyCount;

        })
        .catch(error => {

            console.error(
                "Emergency Count Error:",
                error
            );

        });

}


updateEmergencyCount();


setInterval(
    updateEmergencyCount,
    5000
);


// ===============================
// DONOR BLOOD GROUP STATISTICS
// ===============================

function updateDonorBloodGroupStats() {

    const stats =
        document.getElementById(
            "donorBloodGroupStats"
        );


    if (!stats) return;


    fetch("/api/donors")
        .then(response => response.json())
        .then(donors => {

            const groups = {};


            donors.forEach(donor => {

                const group =
                    donor.bloodGroup;


                groups[group] =
                    (groups[group] || 0) + 1;

            });


            stats.innerHTML = "";


            Object.keys(groups)
                .forEach(group => {

                    stats.innerHTML += `

                        <div class="blood-stat">

                            <strong>
                                ${group}
                            </strong>

                            <span>
                                ${groups[group]}
                                Donors
                            </span>

                        </div>

                    `;

                });

        })
        .catch(error => {

            console.error(
                "Donor Statistics Error:",
                error
            );

        });

}


updateDonorBloodGroupStats();


// ===============================
// DONOR BLOOD GROUP CHART
// ===============================

function createDonorBloodGroupChart() {

    const chartElement =
        document.getElementById(
            "donorBloodGroupChart"
        );


    if (!chartElement) return;


    fetch("/api/donors")
        .then(response => response.json())
        .then(donors => {

            const groups = {};


            donors.forEach(donor => {

                const group =
                    donor.bloodGroup;


                groups[group] =
                    (groups[group] || 0) + 1;

            });


            new Chart(chartElement, {

                type: "bar",

                data: {

                    labels:
                        Object.keys(groups),

                    datasets: [{

                        label: "Donors",

                        data:
                            Object.values(groups)

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {
                                stepSize: 1
                            }

                        }

                    }

                }

            });

        })
        .catch(error => {

            console.error(
                "Donor Chart Error:",
                error
            );

        });

}


createDonorBloodGroupChart();
// Recent Blood Requests

function loadRecentRequests() {

    const recentRequests =
        document.getElementById("recentRequests");

    if (!recentRequests) return;

    fetch("/api/requests")
        .then(response => response.json())
        .then(requests => {

            requests.sort((a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

            const recent =
                requests.slice(0, 5);

            recentRequests.innerHTML = "";

            recent.forEach(request => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>${request.patientName}</td>
                    <td>${request.hospitalName}</td>
                    <td>${request.bloodGroup}</td>
                    <td>${request.units}</td>
                    <td>${request.priority}</td>
                    <td>${request.status}</td>
                `;

                recentRequests.appendChild(row);
            });
        })
        .catch(error => {
            console.error(
                "Recent Requests Error:",
                error
            );
        });
}

loadRecentRequests();
// ===============================
// DONOR LOGIN
// ===============================

const donorLoginForm =
    document.getElementById("donorLoginForm");

if (donorLoginForm) {

    donorLoginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("donorLoginEmail").value.trim();

        const password =
            document.getElementById("donorLoginPassword").value;

        try {

            const response = await fetch("/api/donor-login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            const data = await response.json();

            if (response.ok && data.success) {

                sessionStorage.setItem(
                    "donorId",
                    data.donor.id
                );

                alert("✅ Donor Login Successful!");

                window.location.href =
                    "donor-dashboard.html";

            } else {

                alert(
                    data.message ||
                    "❌ Invalid email or password"
                );

            }

        } catch (error) {

            console.error(
                "Donor Login Error:",
                error
            );

            alert("❌ Server Error");

        }

    });

}
// ===============================
// DONOR DASHBOARD
// ===============================

async function loadDonorDashboard() {

    const donorId =
        sessionStorage.getItem("donorId");

    if (!donorId) {
        window.location.href = "donor-login.html";
        return;
    }

    try {

        const response =
            await fetch("/api/donors");

        const donors =
            await response.json();

        const donor =
            donors.find(
                d => d._id === donorId
            );

        if (!donor) {

            alert("Donor details not found");

            sessionStorage.removeItem("donorId");

            window.location.href =
                "donor-login.html";

            return;
        }

        document.getElementById("donorName").textContent =
            donor.name;

        document.getElementById("donorEmail").textContent =
            donor.email;

        document.getElementById("donorPhone").textContent =
            donor.phone;

        document.getElementById("donorAge").textContent =
            donor.age;

        document.getElementById("donorGender").textContent =
            donor.gender;

        document.getElementById("donorBloodGroup").textContent =
            donor.bloodGroup;

        document.getElementById("donorCity").textContent =
            donor.city;

        document.getElementById("donorLastDonation").textContent =
            donor.lastDonation || "Not Provided";
            document.getElementById("historyLastDonation").textContent =
    donor.lastDonation || "Not Available";

document.getElementById("historyBloodGroup").textContent =
    donor.bloodGroup;
    const historyTable =
    document.getElementById("donationHistoryTable");

if (historyTable) {

    fetch(`/api/donations/${donor._id}`)
        .then(response => response.json())
        .then(donations => {

            historyTable.innerHTML = "";

            if (donations.length === 0) {

                historyTable.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No donation history available.
                        </td>
                    </tr>
                `;

                return;
            }

            donations.forEach(donation => {

                historyTable.innerHTML += `
                    <tr>
                        <td>${donation.donationDate}</td>
                        <td>${donation.bloodGroup}</td>
                        <td>${donation.units}</td>
                        <td>${donation.status}</td>
                    </tr>
                `;

            });

        })
        .catch(error => {

            console.error(
                "Donation History Error:",
                error
            );

            historyTable.innerHTML = `
                <tr>
                    <td colspan="4">
                        Unable to load donation history.
                    </td>
                </tr>
            `;

        });

}

    } catch (error) {

        console.error(
            "Donor Dashboard Error:",
            error
        );

        alert("Unable to load donor details");

    }
}

function donorLogout() {

    sessionStorage.removeItem("donorId");

    window.location.href =
        "donor-login.html";
}

if (
    window.location.pathname.includes(
        "donor-dashboard.html"
    )
) {
    loadDonorDashboard();
}
// ===============================
// ADD DONATION
// ===============================

const donationForm =
    document.getElementById("donationForm");

if (donationForm) {

    donationForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const donationData = {

            donorId:
    document.getElementById("donationDonorId").value.trim(),
            donorName:
                document.getElementById("donationDonorName").value,

            bloodGroup:
                document.getElementById("donationBloodGroup").value,

            donationDate:
                document.getElementById("donationDate").value,

            units:
                Number(
                    document.getElementById("donationUnits").value
                ),

            status:
                document.getElementById("donationStatusInput").value
        };

        try {

            const response =
                await fetch("/api/donations", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(donationData)

                });

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "🩸 Donation added successfully!"
                );

                donationForm.reset();

            } else {

                alert(
                    data.message ||
                    "Unable to add donation"
                );

            }

        } catch (error) {

            console.error(
                "Add Donation Error:",
                error
            );

            alert("Server Error");

        }

    });

}
// ===============================
// DONATION STATISTICS
// ===============================

async function loadDonationStats() {

    try {

        const response = await fetch("/api/donations/all");

        const donations = await response.json();

        document.getElementById("totalDonations").textContent =
            donations.length;

        const totalUnits = donations.reduce(
            (total, donation) => total + Number(donation.units),
            0
        );

        document.getElementById("totalDonationUnits").textContent =
            totalUnits;

        const uniqueDonors = new Set(
            donations.map(donation => donation.donorId)
        );

        document.getElementById("donorsWhoDonated").textContent =
            uniqueDonors.size;

    } catch (error) {

        console.error("Donation Statistics Error:", error);

    }
}

if (window.location.pathname.includes("admin.html")) {
    loadDonationStats();
}
// ===============================
// RECENT DONATIONS
// ===============================

async function loadRecentDonations() {

    try {

        const response =
            await fetch("/api/donations/all");

        const donations =
            await response.json();

        const table =
            document.getElementById("recentDonationsTable");

        if (!table) return;

        table.innerHTML = "";

        donations.slice(0, 5).forEach(donation => {

            table.innerHTML += `
                <tr>
                    <td>${donation.donorName}</td>
                    <td>${donation.bloodGroup}</td>
                    <td>${donation.donationDate}</td>
                    <td>${donation.units}</td>
                    <td>${donation.status}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(
            "Recent Donations Error:",
            error
        );

    }
}

if (window.location.pathname.includes("admin.html")) {
    loadRecentDonations();
}