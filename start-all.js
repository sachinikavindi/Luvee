#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting GreenChart Application...\n');

// Function to start a service
const startService = (name, command, args, cwd) => {
    console.log(`📡 Starting ${name}...`);
    
    const child = spawn(command, args, {
        cwd: join(__dirname, cwd),
        stdio: 'pipe',
        shell: true
    });

    child.stdout.on('data', (data) => {
        console.log(`[${name}] ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
        console.log(`[${name} ERROR] ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
        console.log(`[${name}] Process exited with code ${code}`);
    });

    return child;
};

// Start all services
const services = [
    {
        name: 'Backend API',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: 'backend'
    },
    {
        name: 'Frontend',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: 'frontend'
    },
    {
        name: 'Admin Panel',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: 'admin'
    }
];

const processes = services.map(service => startService(service.name, service.command, service.args, service.cwd));

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all services...');
    processes.forEach(child => child.kill('SIGINT'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down all services...');
    processes.forEach(child => child.kill('SIGTERM'));
    process.exit(0);
});

console.log('\n✅ All services started!');
console.log('🌐 Frontend: http://localhost:3000');
console.log('🔧 Backend API: http://localhost:3000');
console.log('👨‍💼 Admin Panel: http://localhost:3001');
console.log('\nPress Ctrl+C to stop all services');
