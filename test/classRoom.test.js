const { mockRequest, mockResponse } = require('express-async-handler');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const ClassRoom = require('../models/classRoomModel');

describe('Room Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  it('should get all rooms', async () => {
    const roomsMockData = [{ /* Mock room data */ }];
    ClassRoom.find = jest.fn().mockResolvedValue(roomsMockData);
    const req = mockRequest();
    const res = mockResponse();

    await getAllRooms(req, res);

    expect(ClassRoom.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roomsMockData);
  });

  it('should get a room by ID', async () => {
    const roomId = 'roomId';
    const roomMockData = { /* Mock room data */ };
    ClassRoom.findById = jest.fn().mockResolvedValue(roomMockData);
    const req = mockRequest({ params: { id: roomId } });
    const res = mockResponse();

    await getRoomById(req, res);

    expect(ClassRoom.findById).toHaveBeenCalledWith(roomId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roomMockData);
  });

  it('should create a new room', async () => {
    const requestBody = { /* Mock request body */ };
    const roomMockData = { /* Mock room data */ };
    ClassRoom.create = jest.fn().mockResolvedValue(roomMockData);
    const req = mockRequest({ body: requestBody, user: { role: 'admin' } });
    const res = mockResponse();

    await createRoom(req, res);

    expect(ClassRoom.create).toHaveBeenCalledWith(requestBody);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(roomMockData);
  });

  it('should update a room', async () => {
    const roomId = 'roomId';
    const requestBody = { /* Mock request body */ };
    const roomMockData = { /* Mock room data */ };
    ClassRoom.findByIdAndUpdate = jest.fn().mockResolvedValue(roomMockData);
    const req = mockRequest({ params: { id: roomId }, body: requestBody, user: { role: 'admin' } });
    const res = mockResponse();

    await updateRoom(req, res);

    expect(ClassRoom.findByIdAndUpdate).toHaveBeenCalledWith(roomId, requestBody, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roomMockData);
  });

  it('should delete a room', async () => {
    const roomId = 'roomId';
    const roomMockData = { /* Mock room data */ };
    ClassRoom.findById = jest.fn().mockResolvedValue(roomMockData);
    ClassRoom.findByIdAndDelete = jest.fn();
    const req = mockRequest({ params: { id: roomId }, user: { role: 'admin' } });
    const res = mockResponse();

    await deleteRoom(req, res);

    expect(ClassRoom.findById).toHaveBeenCalledWith(roomId);
    expect(ClassRoom.findByIdAndDelete).toHaveBeenCalledWith(roomId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Room deleted successfully' });
  });
});
