import React, { useState, useEffect } from "react";
import Navbar from "@/components/admin/layout/Navbar";
import Sidebar from "@/components/admin/layout/Sidebar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";


function Portfolio() {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service_id: "",
    image: null,
    tecnology_id: [],
  });
  const [EditPopupOpen, setEditPopupOpen] = useState(false);
  const [editportfolio, seteditportfolio] = useState({
    title: "",
    description: "",
    thumbnail: null,
    service_id: "",
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setSidebarHidden(window.innerWidth < 768);
    };

    setSidebarHidden(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  // Fetch Portfolio Data
  const fetchData = async () => {
    const res = await fetch("/api/portfolio/route");
    const result = await res.json();
    console.log(result);
    setPortfolio(result);
    
  };

  // Fetch Services Data
  const fetchServices = async () => {
    const res = await fetch("/api/service/route");
    const result = await res.json();

    // Create a map to store unique service names along with their IDs
    const uniqueServicesMap = new Map();
    result.forEach((service) => {
      // Check if service_name already exists in the map
      if (!uniqueServicesMap.has(service.service_name)) {
        // If not, add it to the map with its ID
        uniqueServicesMap.set(service.service_name, service.service_id);
      }
    });

    // Convert the map to an array of objects containing service_id and service_name
    const uniqueServices = Array.from(uniqueServicesMap.entries()).map(
      ([service_name, service_id]) => ({ service_id, service_name })
    );

    // Update state with the unique services
    setServices(uniqueServices);
  };

  // ------------- get code tecnology------------>
  const [Tecnology, setTecnology] = useState([]);
  const fetchtecnoData = async () => {
    const res = await fetch("/api/tecnology/route");
    const result = await res.json();
    setTecnology(result);
  };

  useEffect(() => {
    fetchData();
    fetchServices();
    fetchPortfolio();
    fetchtecnoData();
  }, []);

  // -------------ADD CODE--------->
  const openPopup = () => {
    setIsAddOpen(true);
  };
  const closePopup = () => {
    setIsAddOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === 'tecnology_id') {
      const values = Array.from(selectedOptions).map((option) => option.value);
      setFormData({ ...formData, [name]: values });

    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const saveData = async () => {

    console.log(formData)
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("service_id", formData.service_id);
    // formDataToSend.append('tecnology_id', formData.tecnology_id);
    formDataToSend.append('tecnology_id', JSON.stringify(formData.tecnology_id));
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("/api/portfolio/route", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();
      if (result.success) {
        setFormData({
          title: "",
          description: "",
          service_id: "",
          tecnology_id: [],
          image: null,
        });
        fetchData();
        closePopup();
      } else {
        console.error("Failed to add portfolio item:", result.error);
      }
    } catch (error) {
      console.error("Error adding portfolio item:", error);
    }
  };


  // ------------DELETE DATA----------->
  const openDeletePopup = (id) => {
    setIsDeletePopupOpen(true);
    setDeleteId(id);
  };
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };
  const deletePortfolio = async () => {
    try {
      const response = await axios.delete(`/api/portfolio/${deleteId}`);
      if (response.status === 200) {
        closeDeletePopup();
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------EDIT DATA----------->
  const openEditPopup = (id) => {
    fetchPortfolio(id);
    setEditPopupOpen(true);
  };
  const closeEditPopup = () => {
    setEditPopupOpen(false);
  };
  const fetchPortfolio = async (editid) => {
    try {
      const response = await axios.get(`/api/portfolio/${editid}`);
      seteditportfolio(response.data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };
  const hendleinputeditchange = (e) => {
    const { name, value } = e.target;
    seteditportfolio((prevservice) => ({
      ...prevservice,
      [name]: value,
    }));
  };
  const handleFileEdit = (e) => {
    seteditportfolio({
      ...editportfolio,
      thumbnail: e.target.files[0],
    });
  };
  const saveEditData = async (editid) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", editportfolio.title);
      formDataToSend.append("description", editportfolio.description);
      formDataToSend.append("thumbnail", editportfolio.thumbnail);
      formDataToSend.append("service_id", editportfolio.service_id);

      const { response } = await axios.put(`/api/portfolio/${editid}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        fetchPortfolio();
        closeEditPopup();
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };
  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.slice(0, maxLength) + '...';
  }

  return (
    <>
      <Sidebar isOpen={!sidebarHidden} toggleSidebar={toggleSidebar} />
      <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
      <button
        className="py-2 px-7 border-2 rounded-lg text-white ms-5 mt-5 absolute right-[6rem]"
        onClick={openPopup}
        style={{ backgroundColor: "#3C91E6" }}
      >
        Add
      </button>

      {/*---------------- DATA TABLE----------  */}
      <div className="relative overflow-x-auto mt-[5rem] ms-[20rem]">
        <table className="w-[90%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg overflow-hidden">
          <thead
            className="text-xs text-white uppercase"
            style={{ backgroundColor: "#3C91E6", borderRadius: "10px" }}
          >
            <tr className="rounded-2xl">
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Thumbnail
              </th>
              <th scope="col" className="px-6 py-3">
                Service
              </th>
              <th scope="col" className="px-6 py-3">
                Technology
              </th>
              <th scope="col" className="px-6 py-3">
                Operation
              </th>
            </tr>
          </thead>

          <tbody>
            {portfolio &&
              portfolio.map((port, index) => (
                <tr
                  key={port.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{port.title}</td>
                  <td className="px-6 py-4">{truncateString(port.description, 5)}</td>
                  <td>
                    <img
                      src={`/assets/Upload/${port.thumbnail}`}
                      alt=""
                      style={{
                        width: "50px",
                        display: "block",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">{port.service_name}</td>
                  <td className="px-6 py-4">{port.tecnology_names}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditPopup(port.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-4 text-1xl"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeletePopup(port.id)}
                      className="font-medium text-red-600 dark:text-blue-500 hover:underline text-1xl"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ------------ADD POPUP MODAL---------- */}
      {isAddOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Portfolio Item</h2>
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            />
            <label className="block mb-2">Service:</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              id="tecno_id"
              name="tecnology_id"
              multiple
              onChange={handleInputChange}
            >
              {Tecnology.map((tecno) => (
                <option key={tecno.id} value={tecno.id}>
                  {tecno.tecno_name}
                </option>
              ))}
            </select>

            <label className="block mb-2">Thumbnail:</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            />
            <button
              onClick={saveData}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={closePopup}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* -------------EDIT POPUP MODAL-------- */}
      {EditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Portfolio</h2>
            <div className="w-full pr-2">
              <label className="block mb-1">Title:</label>
              <input
                type="text"
                name="title"
                value={editportfolio.title}
                onChange={hendleinputeditchange}
                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
              />
            </div>


            <label className="block mb-1">Description:</label>
            <textarea
              name="description"
              value={editportfolio.description}
              onChange={hendleinputeditchange}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            />
            <div className="w-full ">
              <label className="block mb-1">Service:</label>

              <select
                name="service_id"
                value={editportfolio.service_id}
                onChange={hendleinputeditchange}
                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
            </div>
            <label className="block mb-1">Thumbnail:</label>
            <input
              type="file"
              name="thumbnail"
              onChange={handleFileEdit}
              className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
            />

            <img
              src={`/assets/Upload/${editportfolio.thumbnail}`}
              alt="image"
              width="30px"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => saveEditData(editportfolio.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={closeEditPopup}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/*-------------------DELETE POPUP MODAL--------*/}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-xl font-bold mb-4">Delete Portfolio Item</h2>
            <p>Are you sure you want to delete this portfolio item?</p>
            <div className="mt-4">
              <button
                onClick={deletePortfolio}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={closeDeletePopup}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Portfolio;
