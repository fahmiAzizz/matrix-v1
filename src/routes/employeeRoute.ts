import { Router } from 'express';
import { getAllEmployees, getEmployeeById } from '../controllers/employeeController';
import { createUserAndEmployee, deleteUserAndEmployee, updateUserAndEmployee } from '../controllers/userEmployee';



const router = Router();
router.post('/', createUserAndEmployee);
router.patch('/:id', updateUserAndEmployee);
router.delete('/:id', deleteUserAndEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);

export default router;
