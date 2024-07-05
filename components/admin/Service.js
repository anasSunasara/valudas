import React, { useState, useEffect } from "react";
import Navbar from "@/components/admin/layout/Navbar";
import Sidebar from "@/components/admin/layout/Sidebar";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaToggleOn } from "react-icons/fa";

function Product() {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
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

  // ------------- get code tecnology------------>
  const [Tecnology, setTecnology] = useState([]);
  const fetchtecnoData = async () => {
    const res = await fetch("/api/tecnology/route");
    const result = await res.json();
    setTecnology(result);
  };

  // <------------GET CODE fore service--------->
  const [service, setServices] = useState([]);
  const fetchData = async () => {
    const res = await fetch("/api/service/route");
    const result = await res.json();
    const groupedServices = result.reduce((acc, item) => {
      
      const { service_id, service_name, tecno_name } = item;
      if (!acc[service_id]) {
        acc[service_id] = {
          id: service_id,
          service_name: service_name,
          technologies: [],
        };
      }
      acc[service_id].technologies.push(tecno_name);
      return acc;
    }, {});
    const servicesArray = Object.values(groupedServices);
    setServices(servicesArray);
  };
  const techArray = [];
  const allData = {
    techArray: service.map((item) => techArray.push(item.tecno_name)),
  };
  useEffect(() => {
    fetchtecnoData();
    fetchData();
    fetchDataByid();
  }, []);

  // <----------ADD CODE----------------------->
  const [isAddopen, setisAddopen] = useState(false);
  const [formData, setformData] = useState({ service_name: "", tecno_id: [] });
  const openPopup = () => {
    setisAddopen(true);
  };
  const closePopup = () => {
    setisAddopen(false);
  };
  const handleInputChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "tecno_id") {
      const selectedValues = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setformData({
        ...formData,
        [name]: selectedValues,
      });
    } else {
      setformData({
        ...formData,
        [name]: value,
      });
    }
  };
  const saveData = async () => {
    try {
      const response = await axios.post("/api/service/route", formData);
      fetchData();
      closePopup();
    } catch (error) {
      console.log(error);
    }
  };

  // <----------DELETE SERVICE---------------->
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openDeletePopup = (id) => {
    setIsDeletePopupOpen(true);
    setDeleteId(id);
  };
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };
  const handleDelete = async () => {
    axios.delete(`/api/service/${deleteId}`).then((res) => {
      console.log(res);

      fetchData();
      closeDeletePopup();
    });
  };

  //  <-------------EDIT CODE----------------->
  const [EditPopupOpen, setEditPopupOpen] = useState(false);
  const [Editservice, setEditservice] = useState({
    service_name: "",
    tecno_id: [],
  });
  const [editId, setEditId] = useState(null);
  const [allTechnologies, setAllTechnologies] = useState([]);

  const openEditPopup = (id) => {
    setEditId(id);
    fetchDataByid(id);
    setEditPopupOpen(true);
  };
  const closeEditPopup = () => {
    setEditPopupOpen(false);
  };
  async function fetchDataByid(id) {
    try {
      const response = await fetch(`/api/service/${id}`);
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`
        );
      }
      
      const { service, allTechnologies } = await response.json();
      const selectedTechnologies = service.map((item) => item.tecno_id);
      setEditservice({
        service_name: service[0].service_name,
        tecno_id: selectedTechnologies,
      });
      setAllTechnologies(allTechnologies);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const handleInputEditChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const selectedValues = Array.from(selectedOptions).map(
        (option) => option.value
      );
      setEditservice((prevService) => ({
        ...prevService,
        [name]: selectedValues,
      }));
    } else {
      setEditservice((prevService) => ({
        ...prevService,
        [name]: value,
      }));
    }
  };
  // const handleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   setEditservice((prevService) => {
  //     const newTecnoId = checked
  //       ? [...prevService.tecno_id, value]
  //       : prevService.tecno_id.filter(id => id !== value);
  //     return { ...prevService, tecno_id: newTecnoId };
  //   });
  // };

  const saveEditData = async () => {
    try {
      const response = await axios.put(`/api/service/${editId}`, Editservice);
      if(response){
        fetchServiceData();
      closeEditPopup();
      }
      
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <>
      <Sidebar isOpen={!sidebarHidden} toggleSidebar={toggleSidebar} />
      <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
      <button
        className="py-2 px-7 border-2 rounded-lg text-white  ms-5 mt-5 absolute right-[6rem]"
        onClick={openPopup}
        style={{ backgroundColor: "#3C91E6" }}
      >
        Add
      </button>

      <div className="relative overflow-x-auto mt-[5rem] ms-[20rem] ">
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
                Service Name
              </th>
              <th scope="col" className="px-6 py-3">
                Technology
              </th>
              <th scope="col" className="px-6 py-3">
                Operation
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {service.map((service, index) => (
              <tr
                key={service.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{service.service_name}</td>
                <td className="px-6 py-4 flex">
                  {service.technologies.map((tech, index) => (
                    <span key={index} className="block">
                      {tech} ,
                    </span>
                  ))}
                </td>

                <td className="px-6 py-4 row-span-2">
                  <button className="text-blue-500 hover:underline">
                    <FaEdit
                      onClick={() => openEditPopup(service.id)}
                      className=" me-5"
                    />
                  </button>
                  <button onClick={() => openDeletePopup(service.id)}>
                    <MdDelete className=" me-5 text-red-600" />
                  </button>
                </td>
                <td className="px-6 py-4 ">
                  <button>
                    <FaToggleOn className="text-2xl text-blue-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add modal */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {isAddopen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
              <h1 className="text-xl mb-4">ADD SERVICE</h1>
              <div className="my-2">
                <input
                  type="text"
                  name="service_name"
                  placeholder="Service Name"
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="tecno_id"
                  className="block text-left text-sm font-medium text-gray-700"
                >
                  Choose Technologies
                </label>
                <select
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  id="tecno_id"
                  name="tecno_id"
                  multiple
                  onChange={handleInputChange}
                >
                  {Tecnology.map((tecno) => (
                    <option key={tecno.id} value={tecno.id}>
                      {tecno.tecno_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  onClick={saveData}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg ml-2"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {isDeletePopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 w-1/3">
              <h2 className="text-xl font-bold mb-4">Delete Portfolio Item</h2>
              <p>
                Are you sure you want to delete this server and it's technologys
                item?
              </p>
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
      </div>

      {/* EDIT CODE */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {EditPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[70%] md:w-[50%] lg:w-[30%]">
              <h1 className="text-xl mb-4">EDIT SERVICE</h1>
              <div className="my-2">
                <input
                  type="text"
                  name="service_name"
                  placeholder="Edit service"
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={Editservice.service_name}
                  onChange={handleInputEditChange}
                />
              </div>
              {/* <div className="my-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-">
              <label className="form-label col-span-full mb-0">Choose Technologies</label>
              {allTechnologies.map((tecno) => (
                <div key={tecno.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tecno_${tecno.id}`}
                    value={tecno.id}
                    checked={Editservice.tecno_id.includes(tecno.id)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                    
                  />
                  <label htmlFor={`tecno_${tecno.id}`}>{tecno.tecno_name}</label>
                </div>
              ))}
            </div> */}
              <select
                className="mx-4 py-3 mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                id="tecno_id"
                name="tecno_id"
                value={Editservice.tecno_id}
                onChange={handleInputEditChange}
                multiple
              >
                {allTechnologies.map((tecno) => (
                  <option key={tecno.id} value={tecno.id}>
                    {tecno.tecno_name}
                  </option>
                ))}
              </select>
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={saveEditData}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg ml-2 hover:bg-gray-400"
                  onClick={closeEditPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Product;
