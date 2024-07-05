import React, { useState, useEffect } from "react";
import Navbar from "@/components/admin/layout/Navbar";
import Sidebar from "@/components/admin/layout/Sidebar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

function Teknology() {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const [Tecnology, setTecnology] = useState([]);
  const [isAddtecnoopen, setisAddtecnoopen] = useState(false);
  const [service, setServices] = useState([]);
  const [formData, setformData] = useState({
    tecno_name: "",
    tecno_image: null,

  });
  const [IsDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteid, setdeleteit] = useState(null);
  const [editpopupopen, seteditpopupopen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [Edittecnology, setEdittecnology] = useState({
    tecno_name: "",
    tecno_image: null,
  });
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    const handleResize = () => {
      setSidebarHidden(window.innerWidth < 768);
    };

    // Initial check
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

  // get service
  const getservice = async () => {
    const res = await fetch("/api/service/route");
    const result = await res.json();
    setServices(result);
  };
  // get code tecnology
  const fetchData = async () => {
    const res = await fetch("/api/tecnology/route");
    const result = await res.json();
    setTecnology(result);
  };
  useEffect(() => {
    fetchData();
    getservice();
  }, []);

  // <----------ADD CODE---------->
  const openPopup = () => {
    setisAddtecnoopen(true);
  };
  const closePopup = () => {
    setisAddtecnoopen(false);
  };
  const hendelinputchang = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    setformData((prevData) => ({
      ...prevData,
      tecno_image: file,
    }));
    setPreview(URL.createObjectURL(file));
  };
  const saveTechnologyData = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tecno_name', formData.tecno_name);
      formDataToSend.append('tecno_image', formData.tecno_image);
      const response = await axios.post('/api/tecnology/route', formDataToSend,)
      if (response) {
        console.log("in response")
        setformData({
          tecno_name: '',
          tecno_image: null,
        });

        setPreview(null);
        fetchData();
        closePopup();
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // ------------------DELETE DATA---------->
  const openDeletePopup = (id) => {
    setIsDeletePopupOpen(true);
    setdeleteit(id);
  };
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tecnology/${deleteid}`);
      fetchData();
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // -------------------Edit modul----------->
  const openEditPopup = (id) => {
    setEditId(id);
    fetchService(id);
    seteditpopupopen(true);
  };
  const closeEditPopup = () => {
    seteditpopupopen(false);
  };
  const fetchService = async (id) => {
    try {
      const response = await axios.get(`/api/tecnology/${id}`);
      const tecnologyData = response.data;
      setEdittecnology(tecnologyData);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };
  const saveEditData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('tecno_name', Edittecnology.tecno_name);
    formData.append('tecno_image', Edittecnology.tecno_image);
    try {
      const { data } = await axios.put(`/api/tecnology/${editId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
        fetchData();
        closeEditPopup();
    } catch (error) {
      console.error('Error updating technology:', error);
      alert('Error updating technology');
    }
  };
  const hendleinputeditchange = (e) => {
    const { name, value } = e.target;
    setEdittecnology((prevtecnology) => ({
      ...prevtecnology,
      [name]: value,
    }));
  };
  const handleFileEdit = (e) => {
    setEdittecnology({
      ...Edittecnology,
      tecno_image: e.target.files[0],
    });
  };

  return (
    <>
      <Sidebar isOpen={!sidebarHidden} toggleSidebar={toggleSidebar} />
      <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
      <button
        className="py-2 px-7 border-2 rounded-lg text-white ms-5 mt-5 absolute right-24"
        onClick={openPopup}
        style={{ backgroundColor: "#3C91E6" }}
      >
        Add
      </button>
      <div className="relative overflow-x-auto mt-20 ms-80">
        <table className="w-11/12 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg overflow-hidden">
          <thead
            className="text-xs text-white uppercase"
            style={{ backgroundColor: "#3C91E6", borderRadius: "10px" }}
          >
            <tr className="rounded-2xl">
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Technology Name
              </th>
              <th scope="col" className="px-6 py-3">
                Technology image
              </th>
              <th scope="col" className="px-6 py-3">
                Operation
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(Tecnology) && Tecnology.length > 0 ? (
              Tecnology.map((Tec, index) => (
                <tr
                  key={Tec.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4"> {Tec.tecno_name}</td>
                  <td className="py-2 ">
                    <img src={`/assets/Upload/${Tec.tecno_image}`} alt="Technology"
                      style={{
                        width: "40px",
                        display: "block",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }} />
                  </td>

                  <td className="px-6 py-4 flex">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => openEditPopup(Tec.id)}
                    >
                      <FaEdit className=" me-5" />
                    </button>
                    <button onClick={() => openDeletePopup(Tec.id)}>
                      <MdDelete className=" me-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">
                  No technology data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add modal */}
      {isAddtecnoopen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-xl mb-4">ADD TECHNOLOGY</h1>
            <div className="my-2">
              <input
                type="text"
                name="tecno_name"
                placeholder="Technology"
                className="px-8 py-2 rounded-lg border border-black me-2 w-[25rem]"
                value={formData.tecno_name}
                onChange={hendelinputchang}
              />
            </div>
            <input
              type="file"
              id="tecno_image"
              className="py-2 px-1 my-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:border-blue-500"
              onChange={handleImageInputChange}
              accept="image/*"
              required
            />
            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Image Preview" className="h-10 w-10 object-cover" ></img>
              </div>
            )}
            <button
              className="p-2 border-2 rounded-lg text-white bg-green-500 border-green-500 me-2"
              onClick={saveTechnologyData}
            >
              Save
            </button>
            <button
              className="p-2 border-2 rounded-lg text-white bg-red-500 border-red-500"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Delete modal */}
      {IsDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-xl font-bold mb-4">Delete Technologies Item</h2>
            <p>Are you sure you want to delete this technology </p>
            <div className="mt-4">
              <button
                onClick={handleDelete}
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
      {/* Edit modal */}
      {editpopupopen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-xl mb-4">EDIT TECHNOLOGY</h1>
            <div className="my-2">
              <input
                type="text"
                name="tecno_name"
                placeholder="Edit Technology"
                className="px-8 py-3 rounded-lg border border-black me-2 w-[19rem]"
                value={Edittecnology.tecno_name}
                onChange={hendleinputeditchange}
              />
            </div>
            <div className="my-2">
              <input
                type="file"
                name="tecno_image"
                onChange={handleFileEdit}
                className="ps-1 py-2 rounded-lg border border-black me-2 mb-1"
              />
              <img
                src={`/assets/Upload/${Edittecnology.tecno_image}`}
                alt="image"
                width="30px"
              />
            </div>
            <button
              className="p-2 border-2 rounded-lg text-white bg-green-500 border-green-500 me-2"
              onClick={saveEditData}
            >
              Save
            </button>
            <button
              className="p-2 border-2 rounded-lg text-white bg-red-500 border-red-500"
              onClick={closeEditPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Teknology;
